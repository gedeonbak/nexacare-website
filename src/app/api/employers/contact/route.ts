import { NextRequest, NextResponse } from 'next/server';

interface EmployerContact {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  employeeCount?: string;
  role?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: EmployerContact = await req.json();

    const { firstName, lastName, email, company, employeeCount, role, message } = body;

    if (!firstName || !lastName || !email || !company) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // ── HUBSPOT ────────────────────────────────────────────────────────────────
    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
    const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

    let hubspotSuccess = false;

    if (hubspotToken && hubspotPortalId) {
      try {
        // 1. Create or update contact
        const contactRes = await fetch(
          'https://api.hubapi.com/crm/v3/objects/contacts',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${hubspotToken}`,
            },
            body: JSON.stringify({
              properties: {
                firstname: firstName,
                lastname: lastName,
                email: email,
                company: company,
                jobtitle: role || '',
                numberofemployees: employeeCount || '',
                hs_lead_status: 'NEW',
                lifecyclestage: 'lead',
                lead_source: 'Employer Landing Page',
                message: message || '',
              },
            }),
          }
        );

        if (contactRes.ok) {
          hubspotSuccess = true;
          console.log('HubSpot contact created successfully');
        } else {
          // Contact may already exist — try updating via email
          const updateRes = await fetch(
            `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${hubspotToken}`,
              },
              body: JSON.stringify({
                properties: {
                  firstname: firstName,
                  lastname: lastName,
                  company: company,
                  jobtitle: role || '',
                  hs_lead_status: 'NEW',
                  lead_source: 'Employer Landing Page',
                },
              }),
            }
          );
          hubspotSuccess = updateRes.ok;
        }
      } catch (err) {
        console.error('HubSpot error:', err);
        // Non-fatal — continue to Slack
      }
    }

    // ── SLACK ──────────────────────────────────────────────────────────────────
    const slackWebhook = process.env.SLACK_WEBHOOK_LEADS;
    let slackSuccess = false;

    if (slackWebhook) {
      try {
        const employeeLabel = employeeCount
          ? `${employeeCount} employees`
          : 'size not specified';

        const roleLabel = role || 'role not specified';

        const slackRes = await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🏢 *New Employer Lead — nexacaremanagement.com/employers*`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: '🏢 New Employer Lead',
                  emoji: true,
                },
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*Name:*\n${firstName} ${lastName}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Company:*\n${company}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Email:*\n${email}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Role:*\n${roleLabel}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Employee Count:*\n${employeeLabel}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*Source:*\nnexacaremanagement.com/employers`,
                  },
                ],
              },
              ...(message
                ? [
                    {
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: `*Their concern:*\n_${message}_`,
                      },
                    },
                  ]
                : []),
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*HubSpot:* ${hubspotSuccess ? '✅ Contact created/updated' : '⚠️ Manual entry needed'}`,
                },
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'mrkdwn',
                    text: `Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET · Jordan to follow up within 1 business day`,
                  },
                ],
              },
            ],
          }),
        });

        slackSuccess = slackRes.ok;
      } catch (err) {
        console.error('Slack error:', err);
        // Non-fatal
      }
    }

    console.log(`Employer contact: HubSpot=${hubspotSuccess}, Slack=${slackSuccess}`, {
      email,
      company,
      employeeCount,
      role,
    });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    });

  } catch (err) {
    console.error('Employer contact API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
