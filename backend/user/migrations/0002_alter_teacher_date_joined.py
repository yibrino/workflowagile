# Generated by Django 4.2.7 on 2023-11-23 22:17

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacher',
            name='date_joined',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
