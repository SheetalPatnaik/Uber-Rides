# Generated by Django 4.1.13 on 2024-12-06 07:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='available_drivers',
            field=models.JSONField(default=list, null=True),
        ),
    ]
