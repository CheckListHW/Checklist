# Generated by Django 3.0.8 on 2020-10-08 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0002_auto_20200925_0000'),
    ]

    operations = [
        migrations.AddField(
            model_name='exestage',
            name='CheckStuff',
            field=models.BooleanField(null='true'),
            preserve_default='true',
        ),
    ]
