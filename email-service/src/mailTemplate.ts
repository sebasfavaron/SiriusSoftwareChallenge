export const bodyHtml = (name: string, mailService: string) => `
<h2>Welcome${name} from ${mailService}!</h2>
<div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
  
  <p style="font-size:12px; line-height:20px;">
    <a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" target="_blank" style="font-family:sans-serif;text-decoration:none;">
      Unsubscribe
    </a>
    -
    <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="font-family:sans-serif;text-decoration:none;">
      Unsubscribe Preferences
    </a>
  </p>
</div>
`;

export const bodyText = (name: string, mailService: string) =>
  `Welcome${name} from ${mailService}!`;

export const subjectText = 'SiriusSoftware welcome';
