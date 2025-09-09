
export function generateGroupCreatedEmail({ creator, groupName, members }) {
  return `
  <div style="background-color: #f9fafb; padding: 40px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header with Logo -->
      <div style="background: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <img src="https://smart-split-lakshit.vercel.app/logos/logo.png" alt="SmartSplit" style="height: 50px; background-color: #ffffff; padding: 6px; border-radius: 8px;">
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <h2 style="color: #111827; font-size: 22px; margin-bottom: 16px;">New Group Created 👥</h2>

        <p style="font-size: 16px; line-height: 1.5;">
          <strong>${creator.name}</strong> has just created a new group: <strong>${groupName}</strong>.
        </p>

        <!-- Members List -->
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-weight: bold; font-size: 15px;">Group Members:</p>
          <ul style="padding-left: 20px; margin: 0; font-size: 15px; color: #374151;">
            ${members.map(member => `<li>${member.name} (${member.email})</li>`).join('')}
          </ul>
        </div>

        <p style="font-size: 14px; color: #374151;">
          Welcome aboard! Start adding expenses and keep track of everything seamlessly in <strong>${groupName}</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:  linear-gradient(90deg, #059669 0%, #22c55e 100%); padding: 16px; text-align: center; font-size: 13px; color: white;">
        © ${new Date().getFullYear()} SmartSplit. All rights reserved.
      </div>

    </div>
  </div>`;
}
