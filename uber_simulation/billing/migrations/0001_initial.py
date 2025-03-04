# Generated by Django 4.1.13 on 2024-12-09 00:43

from django.db import migrations, models
import utils.validators.validators


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="BillingInformation",
            fields=[
                (
                    "billing_id",
                    models.CharField(
                        max_length=11,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                        validators=[
                            utils.validators.validators.DataValidators.validate_ssn
                        ],
                    ),
                ),
                ("date", models.DateField()),
                ("pickup_time", models.DateTimeField()),
                ("drop_off_time", models.DateTimeField()),
                (
                    "distance_covered",
                    models.DecimalField(decimal_places=2, max_digits=10),
                ),
                ("total_amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("source_location", models.CharField(max_length=255)),
                ("destination_location", models.CharField(max_length=255)),
            ],
            options={
                "ordering": ["-date"],
            },
        ),
    ]
