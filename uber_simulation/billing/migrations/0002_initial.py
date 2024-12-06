# Generated by Django 4.1.13 on 2024-12-05 22:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("billing", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="billinginformation",
            name="customer",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="users.customer"
            ),
        ),
        migrations.AddField(
            model_name="billinginformation",
            name="driver",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
