using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MailSenderAPI.Services
{
    public class MailService
    {
        private readonly string _login;
        private readonly string _password;
        private readonly string _host;
        private readonly int _port;

        public MailService(IConfiguration configuration)
        {
            _login = configuration["Login"];
            _password = configuration["Password"];
            _host = configuration["Host"];
            _port = Int32.Parse(configuration["Port"]);
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

                SmtpClient client = new(_host, _port)
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
