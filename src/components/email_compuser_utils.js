import { send_reply } from "../backend/Connect.js";
import { Contact } from "../data_objects/Contact.js";
import { create_mail_object } from "../utils.js";
import { Create } from "../actions/email_composer";
export function recipient_to_address(recipient) {
  const contact = Contact.create_contact(recipient);
  return contact.get_address();
}

export function get_recipient_addresses_from_email(email) {
  var recipients = {
    to: email.get_recipients(),
    cc: email.get_ccs(),
    bcc: email.get_bccs(),
  };
  for (const key of Object.keys(recipients)) {
    recipients[key] = recipients[key].map((r) => r.get_address());
  }
  return recipients;
}

export function build_email_from_composer(
  to,
  subject,
  html_content,
  cc,
  bcc,
  file_buffers,
  files
) {
  console.log("Building email:");
  console.log(html_content);
  const attachment_buffers = Object.values(files).map((f) => {
    return {
      name: f.name,
      type: f.type,
      buffer: file_buffers[f.name],
    };
  });
  try {
    const email = create_mail_object(
      to,
      subject,
      html_content,
      "html",
      cc,
      bcc,
      attachment_buffers
    );
    return email;
  } catch (err) {
    console.log("error constructing email object: " + err);
  }
}

export async function send_quick_reply(
  to,
  subject,
  html,
  cc,
  bcc,
  file_buffers,
  files,
  dest_id
) {
  const email = build_email_from_composer(
    to,
    subject,
    html,
    cc,
    bcc,
    file_buffers,
    files
  );
  await send_reply(email, dest_id);
  // mail was sent (true)
  return true;
}

export function build_email_action_button(
  dispatch_hook,
  email_type,
  base_email_id,
  cleanup
) {
  const DISPLAY_NAMES = {
    reply: "Reply",
    reply_all: "Reply All",
    forward: "Forward",
  };
  return {
    name: DISPLAY_NAMES[email_type],
    action: () => {
      dispatch_hook(
        Create({
          email_id: base_email_id,
          cleanup: cleanup,
          composer_type: email_type,
        })
      );
    },
  };
}
