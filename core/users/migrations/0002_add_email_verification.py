# Generated migration for email verification fields

from django.db import migrations, models
import django.utils.timezone
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_email_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='EmailOTP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('otp_code', models.CharField(max_length=6)),
                ('purpose', models.CharField(choices=[('registration', 'Registration'), ('login', 'Login'), ('password_reset', 'Password Reset')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField()),
                ('is_used', models.BooleanField(default=False)),
                ('attempts', models.IntegerField(default=0)),
                ('max_attempts', models.IntegerField(default=3)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]