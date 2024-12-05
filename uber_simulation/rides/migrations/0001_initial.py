# Generated by Django 4.1.13 on 2024-12-04 18:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("users", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Ride",
            fields=[
                ("ride_id", models.AutoField(primary_key=True, serialize=False)),
                (
                    "pickup_location_lat",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                (
                    "pickup_location_lng",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                (
                    "dropoff_location_lat",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                (
                    "dropoff_location_lng",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                ("pickup_time", models.DateTimeField()),
                ("dropoff_time", models.DateTimeField(blank=True, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("accepted", "Accepted"),
                            ("in_progress", "In Progress"),
                            ("completed", "Completed"),
                            ("cancelled", "Cancelled"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("passenger_count", models.IntegerField(default=1)),
                (
                    "predicted_fare",
                    models.DecimalField(decimal_places=2, max_digits=10),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "customer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="users.customer"
                    ),
                ),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "rides",
                "ordering": ["-created_at"],
            },
        ),
    ]