# Generated by Django 4.1.13 on 2024-12-01 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_booking_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='chat_id',
            field=models.CharField(max_length=255, null=True),
        ),
    ]