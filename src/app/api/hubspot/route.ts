import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      clinicName,
      role,
      state,
      patientVolume,
      referralSource,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    } = body;

    const properties = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone: phone,
      company: clinicName,
      jobtitle: role,
      state: state,
      glp1_patient_volume: patientVolume,
      referral_source: referralSource,
      utm_source: utm_source,
      utm_medium: utm_medium,
      utm_campaign: utm_campaign,
      utm_content: utm_content,
      utm_term: utm_term,
      lead_source: "Website — Book Demo",
      nexacare_lead_date: new Date().toISOString(),
    };

    // Check if contact already exists by email
    const searchRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: email,
                },
              ],
            },
          ],
        }),
      }
    );
    const searchData = await searchRes.json();

    let hubspotRes: Response;
    if (searchData.total > 0) {
      // Contact exists — update
      const contactId = searchData.results[0].id;
      hubspotRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties }),
        }
      );
    } else {
      // New contact — create
      hubspotRes = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties }),
        }
      );
    }

    if (!hubspotRes.ok) {
      const errorData = await hubspotRes.json();
      console.error("HubSpot API error:", errorData);
      return NextResponse.json(
        { error: "HubSpot submission failed" },
        { status: 500 }
      );
    }

    const hubspotData = await hubspotRes.json();
    return NextResponse.json({ success: true, contactId: hubspotData.id });
  } catch (error) {
    console.error("HubSpot route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
