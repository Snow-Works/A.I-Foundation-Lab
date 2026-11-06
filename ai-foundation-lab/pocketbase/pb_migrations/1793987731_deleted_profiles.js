/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pr0000000000001");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "authAlert": {
      "emailTemplate": {
        "body": "<p style=\"font-size: 16px; line-height: 1.6;\">We noticed a login to your account from a new location:</p>\n<p style=\"font-size: 14px; color: #2EC8FF; background: rgba(46,200,255,0.1); padding: 10px; border-radius: 4px;\">{IP_ADDRESS} - {USER_AGENT}</p>\n<p style=\"font-size: 14px; color: #A8B2D1;\">If this was you, you can disregard this email. If not, please reset your password immediately.</p>",
        "subject": "New login to your AI Foundation Lab account"
      },
      "enabled": true
    },
    "authRule": "",
    "authToken": {
      "duration": 432000
    },
    "confirmEmailChangeTemplate": {
      "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
      "subject": "Confirm your {APP_NAME} new email address"
    },
    "createRule": "",
    "deleteRule": null,
    "emailChangeToken": {
      "duration": 1800
    },
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "prf000000000001",
        "max": 0,
        "min": 0,
        "name": "first_name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "prf000000000002",
        "max": 0,
        "min": 0,
        "name": "middle_name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "prf000000000003",
        "max": 0,
        "min": 0,
        "name": "surname",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "prf000000000004",
        "max": 0,
        "min": 0,
        "name": "whatsapp",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "prf000000000005",
        "max": 0,
        "min": 0,
        "name": "batch",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000006",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "REGISTERED",
          "EMAIL_VERIFIED",
          "APPROVED",
          "PHOTO_VERIFIED",
          "COMMUNITY_UNLOCKED",
          "IDENTITY_CONFIRMED",
          "EXAM_IN_PROGRESS",
          "SUBMITTED",
          "MARKED",
          "REJECTED"
        ]
      },
      {
        "cascadeDelete": false,
        "collectionId": "ad0000000000001",
        "help": "",
        "hidden": false,
        "id": "prf000000000007",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "approved_by",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000008",
        "max": "",
        "min": "",
        "name": "approved_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000009",
        "maxSelect": 1,
        "maxSize": 5242880,
        "mimeTypes": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ],
        "name": "photo",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [
          "256x256",
          "512x512"
        ],
        "type": "file"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000010",
        "name": "photo_verified",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000011",
        "max": "",
        "min": "",
        "name": "photo_verified_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000012",
        "max": "",
        "min": "",
        "name": "identity_confirmed_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000013",
        "max": null,
        "min": 0,
        "name": "attempts_remaining",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "prf000000000014",
        "max": null,
        "min": 0,
        "name": "resets_remaining",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "prf000000000015",
        "max": 0,
        "min": 0,
        "name": "notes",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "cost": 0,
        "help": "",
        "hidden": true,
        "id": "password901924565",
        "max": 0,
        "min": 8,
        "name": "password",
        "pattern": "",
        "presentable": false,
        "required": true,
        "system": true,
        "type": "password"
      },
      {
        "autogeneratePattern": "[a-zA-Z0-9]{50}",
        "help": "",
        "hidden": true,
        "id": "text2504183744",
        "max": 60,
        "min": 30,
        "name": "tokenKey",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "exceptDomains": [],
        "help": "",
        "hidden": false,
        "id": "email3885137012",
        "name": "email",
        "onlyDomains": [],
        "presentable": false,
        "required": true,
        "system": true,
        "type": "email"
      },
      {
        "help": "",
        "hidden": false,
        "id": "bool1547992806",
        "name": "emailVisibility",
        "presentable": false,
        "required": false,
        "system": true,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "bool256245529",
        "name": "verified",
        "presentable": false,
        "required": false,
        "system": true,
        "type": "bool"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1341452863",
        "max": 0,
        "min": 0,
        "name": "dummy",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }
    ],
    "fileToken": {
      "duration": 180
    },
    "id": "pr0000000000001",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_pr0000000000001` ON `profiles` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_pr0000000000001` ON `profiles` (`email`) WHERE `email` != ''"
    ],
    "listRule": "id = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "manageRule": null,
    "mfa": {
      "duration": 600,
      "enabled": false,
      "rule": ""
    },
    "name": "profiles",
    "oauth2": {
      "enabled": true,
      "mappedFields": {
        "avatarURL": "",
        "id": "",
        "name": "",
        "username": ""
      }
    },
    "otp": {
      "duration": 180,
      "emailTemplate": {
        "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "OTP for {APP_NAME}"
      },
      "enabled": false,
      "length": 8
    },
    "passwordAuth": {
      "enabled": true,
      "identityFields": [
        "email"
      ]
    },
    "passwordResetToken": {
      "duration": 1800
    },
    "resetPasswordTemplate": {
      "body": "<div style=\"background-color: #0A0630; padding: 40px 20px; font-family: 'Inter', Arial, sans-serif; color: #DCE3F5; text-align: center;\">\n  <div style=\"max-width: 500px; margin: 0 auto; background-color: #140A5C; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px 30px;\">\n    <h1 style=\"color: #FFFFFF; font-size: 24px; font-weight: 800; margin-bottom: 20px; letter-spacing: -0.5px;\">Reset Your Password</h1>\n    <p style=\"font-size: 16px; line-height: 1.6; margin-bottom: 30px;\">We received a request to reset the password for your AI Foundation Lab account. If you made this request, click the button below.</p>\n    <a href=\"{APP_URL}/#/reset-password?token={TOKEN}&email={EMAIL}\" style=\"display: inline-block; background: linear-gradient(135deg, #FF3FA4 0%, #F2511F 100%); color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 30px;\">Reset Password</a>\n    <p style=\"font-size: 13px; color: #A8B2D1;\">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>\n  </div>\n</div>",
      "subject": "Reset your AI Foundation Lab password"
    },
    "system": false,
    "type": "auth",
    "updateRule": "id = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "verificationTemplate": {
      "body": "<div style=\"background-color: #0A0630; padding: 40px 20px; font-family: 'Inter', Arial, sans-serif; color: #DCE3F5; text-align: center;\">\n  <div style=\"max-width: 500px; margin: 0 auto; background-color: #140A5C; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px 30px;\">\n    <h1 style=\"color: #FFFFFF; font-size: 24px; font-weight: 800; margin-bottom: 20px; letter-spacing: -0.5px;\">AI Foundation Lab</h1>\n    <p style=\"font-size: 16px; line-height: 1.6; margin-bottom: 30px;\">Welcome to the guild. You're almost in. Please click the button below to verify your email address and activate your account.</p>\n    <a href=\"{APP_URL}/#/auth/verified?token={TOKEN}&email={EMAIL}\" style=\"display: inline-block; background: linear-gradient(135deg, #FF3FA4 0%, #F2511F 100%); color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 30px;\">Verify Email Address</a>\n    <p style=\"font-size: 12px; color: #A8B2D1;\">If the button doesn't work, copy and paste this link into your browser:<br><br>{APP_URL}/#/auth/verified?token={TOKEN}&email={EMAIL}</p>\n  </div>\n</div>",
      "subject": "Verify your email for AI Foundation Lab"
    },
    "verificationToken": {
      "duration": 86400
    },
    "viewRule": "id = @request.auth.id || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
})
