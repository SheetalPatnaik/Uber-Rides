# Generated by Django 5.1.3 on 2024-11-30 18:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                (
                    "customer_id",
                    models.CharField(max_length=11, primary_key=True, serialize=False),
                ),
                ("first_name", models.CharField(max_length=50)),
                ("last_name", models.CharField(max_length=50)),
                ("address", models.CharField(max_length=255)),
                ("city", models.CharField(max_length=100)),
                ("state", models.CharField(max_length=50)),
                ("zip_code", models.CharField(max_length=20)),
                ("phone_number", models.CharField(max_length=15)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("credit_card", models.CharField(max_length=20)),
                ("password", models.CharField(max_length=255, null=True)),
            ],
            options={
                "db_table": "customers",
            },
        ),
        migrations.CreateModel(
            name="Booking",
            fields=[
                ("booking_id", models.AutoField(primary_key=True, serialize=False)),
                ("pickup_location", models.CharField(max_length=255)),
                (
                    "pickup_latitude",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                (
                    "pickup_longitude",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                ("dropoff_location", models.CharField(max_length=255)),
                (
                    "dropoff_latitude",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                (
                    "dropoff_longitude",
                    models.DecimalField(decimal_places=6, max_digits=9),
                ),
                (
                    "ride_type",
                    models.CharField(
                        choices=[
                            ("XL", "XL (4 passengers)"),
                            ("XXL", "XXL (6 passengers)"),
                        ],
                        default="XL",
                        max_length=10,
                    ),
                ),
                (
                    "num_passengers",
                    models.IntegerField(
                        choices=[
                            (1, "1"),
                            (2, "2"),
                            (3, "3"),
                            (4, "4"),
                            (5, "5"),
                            (6, "6"),
                        ],
                        default=1,
                    ),
                ),
                (
                    "predicted_fare",
                    models.DecimalField(blank=True, decimal_places=2, max_digits=10),
                ),
                ("booking_date", models.DateTimeField(auto_now_add=True)),
                ("status", models.CharField(default="pending", max_length=20)),
                (
                    "customer",
                    models.ForeignKey(
                        db_column="customer_id",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="users.customer",
                    ),
                ),
            ],
            options={
                "db_table": "users_booking",
            },
        ),
    ]
