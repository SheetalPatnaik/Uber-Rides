# Generated by Django 4.1.13 on 2024-12-05 22:35

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import utils.validators.validators


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Driver",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "driver_id",
                    models.CharField(
                        max_length=11,
                        unique=True,
                        validators=[
                            utils.validators.validators.DataValidators.validate_ssn
                        ],
                    ),
                ),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("phone_number", models.CharField(max_length=16, unique=True)),
                ("address", models.CharField(max_length=255)),
                ("city", models.CharField(max_length=100)),
                (
                    "state",
                    models.CharField(
                        max_length=2,
                        validators=[
                            utils.validators.validators.DataValidators.validate_state
                        ],
                    ),
                ),
                (
                    "zipcode",
                    models.CharField(
                        max_length=10,
                        validators=[
                            utils.validators.validators.DataValidators.validate_zipcode
                        ],
                    ),
                ),
                (
                    "vehicle_type",
                    models.CharField(
                        choices=[
                            ("sedan", "Sedan"),
                            ("suv", "SUV"),
                            ("van", "Van"),
                            ("luxury", "Luxury"),
                        ],
                        max_length=20,
                    ),
                ),
                ("vehicle_model", models.CharField(max_length=50)),
                ("vehicle_plate", models.CharField(max_length=15, unique=True)),
                ("license_number", models.CharField(max_length=20, unique=True)),
                (
                    "rating",
                    models.DecimalField(decimal_places=2, default=5.0, max_digits=3),
                ),
                ("total_trips", models.IntegerField(default=0)),
                (
                    "current_location_lat",
                    models.DecimalField(decimal_places=6, max_digits=9, null=True),
                ),
                (
                    "current_location_lng",
                    models.DecimalField(decimal_places=6, max_digits=9, null=True),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("available", "Available"),
                            ("busy", "Busy"),
                            ("offline", "Offline"),
                        ],
                        default="offline",
                        max_length=20,
                    ),
                ),
                (
                    "introduction_video",
                    models.FileField(blank=True, null=True, upload_to="driver_videos/"),
                ),
                (
                    "profile_photo",
                    models.ImageField(
                        blank=True, null=True, upload_to="driver_photos/"
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to.",
                        related_name="driver_set",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="driver_set",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "passenger",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="driver",
            constraint=models.UniqueConstraint(
                fields=("email",), name="unique_driver_email"
            ),
        ),
        migrations.AddConstraint(
            model_name="driver",
            constraint=models.UniqueConstraint(
                fields=("phone_number",), name="unique_driver_phone"
            ),
        ),
    ]
