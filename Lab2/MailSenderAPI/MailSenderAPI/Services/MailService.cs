using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MailSenderAPI.Services
{
    public class MailService
    {
        private readonly string _login;
        private readonly string _password;

        public MailService(IConfiguration configuration)
        {
            _login = configuration["Login"];
            _password = configuration["Password"];
        }

        public async Task<bool> TrySendMailAsync(MailAddress mailAddress, string author, string text)
        {
            try
            {
                MailMessage mail = new()
                {
                    From = new MailAddress(_login, author),
                    To = { mailAddress },
                    Body = text,
                    IsBodyHtml = true
                };

                SmtpClient client = new("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(_login, _password),
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    EnableSsl = true
                };

                await client.SendMailAsync(mail);
            }
            catch (System.Exception)
            {

                return false;
            }

            return true;
        }
    }
}
