import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface ReminderContext {
  disputeId: string;
  userId: string;
  creditorName: string;
  bureau: string;
  daysUntilDeadline: number;
  status: string;
}

async function generateAIReminderMessage(context: ReminderContext): Promise<{ title: string; message: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful credit education assistant. Generate a brief, encouraging notification message for a user about their credit dispute. Keep it professional, supportive, and action-oriented. Respond in JSON format with "title" and "message" fields.`
        },
        {
          role: "user",
          content: `Generate a reminder notification for a dispute with ${context.creditorName} (${context.bureau}). 
Status: ${context.status}
Days until 30-day response deadline: ${context.daysUntilDeadline}

The notification should remind them about the upcoming deadline and suggest what to do if no response is received.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error generating AI reminder:", error);
  }

  return {
    title: `Deadline Approaching: ${context.creditorName}`,
    message: `Your dispute with ${context.creditorName} (${context.bureau}) has ${context.daysUntilDeadline} days until the 30-day response deadline. Keep track of your certified mail receipt and be ready to escalate if no response is received.`
  };
}

async function checkAndCreateReminders() {
  try {
    const disputesNeedingReminders = await storage.getDisputesNeedingReminders();
    
    for (const dispute of disputesNeedingReminders) {
      if (!dispute.responseDeadline) continue;
      
      const deadline = new Date(dispute.responseDeadline);
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      const existingNotifications = await storage.getNotificationsForUser(dispute.userId);
      const hasRecentReminder = existingNotifications.some(n => 
        n.disputeId === dispute.id && 
        n.type === "DEADLINE_APPROACHING" &&
        new Date(n.createdAt).getTime() > now.getTime() - (24 * 60 * 60 * 1000)
      );
      
      if (hasRecentReminder) continue;
      
      const context: ReminderContext = {
        disputeId: dispute.id,
        userId: dispute.userId,
        creditorName: dispute.creditorName,
        bureau: dispute.bureau,
        daysUntilDeadline,
        status: dispute.status,
      };
      
      const { title, message } = await generateAIReminderMessage(context);
      
      await storage.createNotification({
        userId: dispute.userId,
        disputeId: dispute.id,
        type: "DEADLINE_APPROACHING",
        title,
        message,
        scheduledFor: new Date(),
        deliveredAt: new Date(),
      });
      
      console.log(`Created deadline reminder for dispute ${dispute.id}`);
    }
    
    const allMailed = await storage.getDisputesNeedingReminders();
    for (const dispute of allMailed) {
      if (!dispute.mailedAt || !dispute.responseDeadline) continue;
      
      const deadline = new Date(dispute.responseDeadline);
      const now = new Date();
      
      if (now > deadline && !dispute.responseReceivedAt) {
        const existingNotifications = await storage.getNotificationsForUser(dispute.userId);
        const hasNoResponseReminder = existingNotifications.some(n => 
          n.disputeId === dispute.id && 
          n.type === "NO_RESPONSE"
        );
        
        if (!hasNoResponseReminder) {
          await storage.createNotification({
            userId: dispute.userId,
            disputeId: dispute.id,
            type: "NO_RESPONSE",
            title: `No Response: ${dispute.creditorName}`,
            message: `The 30-day deadline has passed for your dispute with ${dispute.creditorName} (${dispute.bureau}) without a response. Under FCRA Section 611, the bureau must delete or correct the disputed item. Consider sending a follow-up letter or escalating your complaint.`,
          });
          
          console.log(`Created no-response notification for dispute ${dispute.id}`);
        }
      }
    }
  } catch (error) {
    console.error("Error in notification scheduler:", error);
  }
}

export function startNotificationScheduler() {
  console.log("Starting notification scheduler...");
  
  checkAndCreateReminders();
  
  const intervalMs = 60 * 60 * 1000;
  setInterval(checkAndCreateReminders, intervalMs);
}

export { checkAndCreateReminders };
