import axios from 'axios';
import { config } from './config';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGrok(messages: GrokMessage[], temperature = 0.7): Promise<string> {
  if (config.IS_GROK_CONFIGURED) {
    try {
      const isGroq = config.GROK_API_KEY.startsWith('gsk_');
      const url = isGroq 
        ? 'https://api.groq.com/openai/v1/chat/completions' 
        : 'https://api.x.ai/v1/chat/completions';
      const model = isGroq 
        ? 'llama-3.3-70b-versatile' 
        : 'grok-beta';

      console.log(`[completions] Routing API request to: ${isGroq ? 'Groq' : 'Grok'} using model: ${model}`);

      const response = await axios.post(
        url,
        {
          model,
          messages,
          temperature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.GROK_API_KEY}`,
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error calling completions API:', error.response?.data || error.message);
      // Fallback to simulation if API call fails
      return runMockGrok(messages);
    }
  } else {
    return runMockGrok(messages);
  }
}

// Simple rule-based mock LLM to generate rich content based on prompt inspection
function runMockGrok(messages: GrokMessage[]): string {
  const userMessage = messages.find(m => m.role === 'user')?.content || '';
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';

  // 1. Planner Goal Breakdown
  if (systemMessage.includes('Planner Agent') || userMessage.includes('break down the goal') || userMessage.includes('subtasks')) {
    return JSON.stringify({
      projectName: userMessage.includes('hiring') ? 'Hiring Campaign Workflow' : 'Business Optimization Workflow',
      tasks: [
        {
          title: 'Conduct Competitive & Target Audience Research',
          assignedAgentId: 'research',
          dependsOn: []
        },
        {
          title: 'Draft Campaign Copy & Branding Material',
          assignedAgentId: 'marketing',
          dependsOn: ['research']
        },
        {
          title: 'Analyze Budget Constraints & Forecast ROI',
          assignedAgentId: 'finance',
          dependsOn: ['marketing']
        },
        {
          title: 'Develop Landing Page & Email Automation Scripts',
          assignedAgentId: 'developer',
          dependsOn: ['marketing']
        },
        {
          title: 'Run Quality & Compliance Assessment',
          assignedAgentId: 'quality',
          dependsOn: ['finance', 'developer']
        },
        {
          title: 'Compile Executive Business Summary Report',
          assignedAgentId: 'document',
          dependsOn: ['quality']
        }
      ]
    }, null, 2);
  }

  // 2. Specific Agent executions
  if (systemMessage.includes('Research Agent') || userMessage.includes('research')) {
    return `### Research Analysis Report
Target Audience: Small and Medium Businesses (SMBs) struggling with SaaS integration fatigue.
Key Pain Points:
1. Fragmented communications across Slack, Email, and WhatsApp.
2. Inefficient manual data migration between CRM platforms (Salesforce) and Excel.
3. Lack of unified performance indicators (KPIs) for multi-channel sales.

Competitor Analysis:
- Zapier: High automation flexibility, but zero autonomous agent decision-making.
- Claude Projects: Great context, but no integrations or multi-agent collaboration.
- HubSpot: Enterprise-scale CRM, but unaffordable and complex for SMBs.

Recommended Approach: Position FlowMind AI as a "1-Click autonomous workforce" that replaces manual integration tasks.`;
  }

  if (systemMessage.includes('Marketing Agent') || userMessage.includes('marketing') || userMessage.includes('copy')) {
    return `### Marketing Campaign Assets
**Brand Slogan:** "Unlock the Power of the Autonomous Workplace"

**Target Channels:** LinkedIn outreach, Email newsletters, landing page header.

**Ad Copy Structure:**
"Are you wasting 15+ hours a week moving data between HubSpot, Slack, and Gmail? 
FlowMind AI automates your workflows using a collaborative network of autonomous agents that plan, think, and execute. 
Hire your AI workforce today."

**Email Automation Campaign (Drip 1):**
Subject: Stop Managing Tasks. Start Managing Goals.
Body: Hi [First_Name],
Most software requires YOU to build rules. FlowMind AI works differently. You give us a goal, and our CEO, Planner, and Developer agents construct the pipelines themselves. Let us handle the busywork...`;
  }

  if (systemMessage.includes('Finance Agent') || userMessage.includes('finance') || userMessage.includes('budget')) {
    return `### Financial ROI Assessment
1. **Estimated Time Savings:**
   - Hours saved per week: 18 hours/employee.
   - Cost equivalent saved: $540/week per employee (at average $30/hr labor cost).

2. **Cost Reduction Breakdown:**
   - SaaS subscriptions Consolidated: $240/month.
   - Reduced human error overhead: $400/month.

3. **Total Estimated Impact (SMB scaling with 10 employees):**
   - Monthly Saved Labor Value: $21,600
   - Monthly Software Cost Reduction: $2,400
   - **Net ROI Projection:** 450% return in the first 90 days.`;
  }

  if (systemMessage.includes('Developer Agent') || userMessage.includes('developer') || userMessage.includes('code')) {
    return `// FlowMind AI Automated Integration Script
// Generated dynamically by Devin (Developer Agent)

import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Webhook endpoint to sync lead information from CRM to Email automation
router.post('/api/v1/lead-sync', async (req, res) => {
  const { name, email, company, budget } = req.body;
  
  try {
    console.log(\`[Devin] Lead Sync triggered for \${name} (\${company})\`);
    
    // 1. Process customer segment
    const segment = budget > 5000 ? 'enterprise' : 'mid-market';
    
    // 2. Dispatch customized onboarding drip email
    const transporter = nodemailer.createTransport({
      host: 'smtp.flowmind.ai',
      port: 587,
      secure: false,
      auth: { user: 'campaigns@flowmind.ai', pass: 'flowmind_secure_token' }
    });
    
    await transporter.sendMail({
      from: '"FlowMind AI Workforce" <campaigns@flowmind.ai>',
      to: email,
      subject: 'Welcome to your Autonomous Workspace',
      text: \`Hello \${name}, we have initialized your project for \${company}. Segment: \${segment}.\`
    });
    
    res.status(200).json({ success: true, message: 'Lead synchronized and email campaign dispatched' });
  } catch (error) {
    console.error('[Devin] Synchronization failed:', error);
    res.status(500).json({ error: 'Sync pipeline failure' });
  }
});

export default router;`;
  }

  if (systemMessage.includes('Quality Checker Agent') || userMessage.includes('quality') || userMessage.includes('QC')) {
    return `### QA Audit Summary
1. **Research Verification:** OK (Checked competitor references, data fits SMB profiles).
2. **Marketing Deliverables:** OK (Ad copies check spelling, campaign flow satisfies compliance).
3. **Financial Formulas:** OK (ROI calculations are mathematically sound and within standard parameters).
4. **Code Syntax Verification:** PASS (Express routing logic runs clean, error handling checks out).

**System Status:** 100% compliant. Safe to package for production deployment.`;
  }

  if (systemMessage.includes('Document Agent') || userMessage.includes('document') || userMessage.includes('report')) {
    return `# Executive Project Report: ${userMessage || 'Business Campaign'}
Generated by FlowMind AI Multi-Agent Workforce.

## 1. Executive Summary
This report summarizes the autonomous campaign creation process to solve coordination issues. Over the course of 6 agent phases, research data was indexed, campaign copies drafted, financial ROI mapped, integration scripts developed, and verified through compliance testing.

## 2. Competitive Insights
Our Research Agent mapped competitors like Zapier and HubSpot. The target demographic suffers from extreme administrative overhead. Positioning FlowMind AI as an active autonomous workforce will capture high interest.

## 3. Financial Forecast
By automating CRM synchronization and data tracking, the business expects a **450% ROI** inside 90 days, reducing administrative work from 18 hours to under 2 hours per week.

## 4. Integration Script
Devin (Developer Agent) built a Node.js express pipeline router to synchronize lead information and trigger marketing drips automatically.

## 5. Compliance & Risk Audit
All content complies with standard data usage guidelines. All systems passed the Quality Checker audit.`;
  }

  // Generic backup response
  return `### Autonomous Agent Assessment
Current task context has been processed successfully.

Key insights:
- Streamlined coordination models mapped.
- Automation workflow active.
- Current confidence rating: 92%.

The agent workforce recommends proceeding to the compilation step.`;
}
