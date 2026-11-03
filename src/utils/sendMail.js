const transporter = require("../config/mail.config");
const generateOtp = require("./generateOtp");

class SendMail {
  static async verifyEmail(user) {
    console.log("log1")
    const otp = await generateOtp(user._id);
    console.log("log2")
    console.log("otp", otp)
    console.log("user", user)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "otp- verify your account",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          ">

            <!-- Header -->
            <div style="
              background-color: #4f46e5;
              padding: 25px;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
              ">
                Verify Your Email
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 35px;">

              <h2 style="
                margin-top: 0;
                color: #222222;
              ">
                Hello ${user.name},
              </h2>

              <p style="
                font-size: 16px;
                line-height: 1.6;
              ">
                Thank you for creating an account with us.
                Please use the verification code below to verify your email address.
              </p>

              <!-- OTP -->
              <div style="
                margin: 30px 0;
                text-align: center;
              ">

                <p style="
                  margin-bottom: 10px;
                  color: #555555;
                  font-size: 15px;
                ">
                  Your Verification Code
                </p>

                <div style="
                  display: inline-block;
                  padding: 15px 30px;
                  background-color: #f3f4f6;
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  font-size: 30px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #4f46e5;
                ">
                  ${otp}
                </div>

              </div>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                This OTP is required to verify your account.
                Please do not share this code with anyone.
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                If you did not create this account, you can safely ignore this email.
              </p>

              <p style="
                margin-top: 30px;
                font-size: 15px;
              ">
                Thank you,<br />
                <strong>Admin Team</strong>
              </p>

            </div>

            <!-- Footer -->
            <div style="
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #888888;
              font-size: 12px;
            ">
              <p style="margin: 0;">
                This is an automated email. Please do not reply.
              </p>
            </div>

          </div>

        </body>
        </html>
      `,
      });
      console.log("final")
      return otp;
    } catch (error) {
      throw error;
    }
  }


  
static async sendBookingSummary({user, bookings}) {
  try {
    const bookingRows = bookings.map((booking, index) => {
      const movieName = booking.movie?.name || "N/A";
      const theaterName = booking.theater?.theaterName || "N/A";

      const showTiming = booking.show?.showTiming
        ? new Date(booking.show.showTiming).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "N/A";

      const tickets = booking.numberOfTicket || 0;
      const status = booking.status || "N/A";

      const statusColor =
        status === "confirmed" ? "#16a34a" : "#dc2626";

      return `
        <tr>
          <td style="padding:12px;border:1px solid #ddd;">${index + 1}</td>
          <td style="padding:12px;border:1px solid #ddd;">${movieName}</td>
          <td style="padding:12px;border:1px solid #ddd;">${theaterName}</td>
          <td style="padding:12px;border:1px solid #ddd;">${showTiming}</td>
          <td style="padding:12px;border:1px solid #ddd;text-align:center;">${tickets}</td>
          <td style="padding:12px;border:1px solid #ddd;color:${statusColor};font-weight:bold;">
            ${status}
          </td>
        </tr>
      `;
    }).join("");

    const totalBookings = bookings.length;

    const totalTickets = bookings.reduce(
      (total, booking) => total + (booking.numberOfTicket || 0),
      0
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Your Movie Booking Summary",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Booking Summary</title>
        </head>

        <body style="
          margin:0;
          padding:20px;
          background-color:#f4f6f8;
          font-family:Arial,Helvetica,sans-serif;
          color:#333;
        ">

          <div style="
            max-width:750px;
            margin:20px auto;
            background:#ffffff;
            border-radius:10px;
            overflow:hidden;
          ">

            <div style="
              background:#4f46e5;
              padding:25px;
              text-align:center;
            ">
              <h1 style="margin:0;color:#fff;">
                Booking Summary
              </h1>
            </div>

            <div style="padding:25px;">

              <h2>Hello ${user.name},</h2>

              <p>
                Here is the summary of all your movie bookings.
                Thank you for choosing our booking service!
              </p>

              <div style="overflow-x:auto;">
                <table style="
                  width:100%;
                  border-collapse:collapse;
                  margin-top:20px;
                  font-size:13px;
                  text-align:left;
                ">
                  <thead>
                    <tr style="background:#f3f4f6;">
                      <th style="padding:12px;border:1px solid #ddd;">#</th>
                      <th style="padding:12px;border:1px solid #ddd;">Movie</th>
                      <th style="padding:12px;border:1px solid #ddd;">Theater</th>
                      <th style="padding:12px;border:1px solid #ddd;">Show Timing</th>
                      <th style="padding:12px;border:1px solid #ddd;">Tickets</th>
                      <th style="padding:12px;border:1px solid #ddd;">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${bookingRows}
                  </tbody>
                </table>
              </div>

              <div style="
                margin-top:25px;
                padding:18px;
                background:#f3f4f6;
                border-radius:8px;
              ">
                <p><strong>Total Bookings:</strong> ${totalBookings}</p>
                <p><strong>Total Tickets:</strong> ${totalTickets}</p>
              </div>

              <p style="margin-top:25px;">
                Thank you,<br />
                <strong>Admin Team</strong>
              </p>

            </div>

            <div style="
              background:#f8f9fa;
              padding:18px;
              text-align:center;
              color:#888;
              font-size:12px;
            ">
              This is an automated email. Please do not reply.
            </div>

          </div>

        </body>
        </html>
      `,
    });

    return true;

  } catch (error) {
    throw error;
  }
}

}

module.exports = SendMail;
