# Generated by Django 3.0.8 on 2020-10-09 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0003_exestage_checkstuff'),
    ]

    operations = [
        migrations.AddField(
            model_name='execalcparameter',
            name='Period',
            field=models.BooleanField(null='true'),
            preserve_default='true',
        ),
    ]
