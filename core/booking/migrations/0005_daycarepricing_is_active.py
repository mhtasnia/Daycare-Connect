# Generated by Django 5.2.3 on 2025-07-22 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0004_alter_daycarepricing_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="daycarepricing",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
    ]
