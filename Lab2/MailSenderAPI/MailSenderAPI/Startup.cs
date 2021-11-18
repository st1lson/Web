using AspNetCoreRateLimit;
using MailSenderAPI.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace MailSenderAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
            _allowOrigins = "production";
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }
        private readonly string _allowOrigins;

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "MailSenderAPI", Version = "v1" });
            });

            services.AddScoped<MailService>();

            services.AddCors(options =>
            {
                options.AddPolicy(_allowOrigins,
                    builder => builder.WithOrigins("https://mail-sender-client.azurewebsites.net")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            services.AddOptions();
            services.AddMemoryCache();
            services.AddInMemoryRateLimiting();
            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

            services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimit"));
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseCors(_allowOrigins);   

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseIpRateLimiting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
