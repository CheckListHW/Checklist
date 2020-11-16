from django.db import models


# Create your models here.
class Experiment(models.Model):
    Number = models.IntegerField()
    Name = models.CharField(max_length=20)


class Stage(models.Model):
    Experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE, null='true')
    Number = models.IntegerField(null='true')
    Name = models.CharField(max_length=20, null='true')
    Description = models.CharField(max_length=200, null='true')
    Duration = models.FloatField(null='true')
    Risks = models.CharField(max_length=200, null='true')
    Attention = models.CharField(max_length=200, null='true')
    OtherOption = models.BooleanField(null='true')
    PreparatoryStage = models.BooleanField(null='true')


class SubStage(models.Model):
    Main = models.ForeignKey(Stage, on_delete=models.CASCADE, null='true')
    Parent = models.ForeignKey('self', on_delete=models.CASCADE, null='true')
    Number = models.IntegerField(null='true')
    Criterion = models.CharField(max_length=200, null='true')
    Name = models.CharField(max_length=200, null='true')
    Risks = models.CharField(max_length=200, null='true')
    Condition = models.CharField(max_length=200, null='true')
    Attention = models.CharField(max_length=200, null='true')
    Duration = models.FloatField(null='true')
    Picture = models.BooleanField(null='true')
    Runtime = models.FloatField(null='true')
    OtherOption = models.BooleanField(null='true')
    ReplayMessage = models.CharField(max_length=200, null='true')



class Parameter(models.Model):
    MainStage = models.ForeignKey(Stage, on_delete=models.CASCADE, null='true')
    SubStage = models.ForeignKey(SubStage, on_delete=models.CASCADE)
    ParameterName = models.CharField(max_length=30)
    From = models.FloatField(null='true')
    To = models.FloatField(null='true')
    Unit = models.CharField(max_length=30, null='true')
    ExactValue = models.FloatField(null='true')
    Equipment = models.CharField(max_length=302, null='true')


class CalcParameter(models.Model):
    MainStage = models.ForeignKey(Stage, on_delete=models.CASCADE, null='true')
    SubStage = models.ForeignKey(SubStage, on_delete=models.CASCADE)
    ParameterName = models.CharField(max_length=30)
    Unit = models.CharField(max_length=30, null='true')
    VarName = models.CharField(max_length=30, null='true')
    Period = models.BooleanField(null='true')


class Equipment(models.Model):
    Name = models.CharField(max_length=50)
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE)


class Dishes(models.Model):
    Name = models.CharField(max_length=50)
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE)


class Reagents(models.Model):
    Name = models.CharField(max_length=50)
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE)


class ProtectiveEquipment(models.Model):
    Name = models.CharField(max_length=50)
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE)


class Doc(models.Model):
    Name = models.CharField(max_length=50)
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE)


class Paragraph(models.Model):
    Name = models.CharField(max_length=200, null='true')
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE, null='true')
    PreparatoryStage = models.IntegerField(null='true')
    PreparatoryStageName = models.CharField(max_length=302, null='true')


class Criterion(models.Model):
    Name = models.CharField(max_length=200)
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE)


class Replay(models.Model):
    MainStage = models.ForeignKey(Stage, on_delete=models.CASCADE, null='true')
    SubStage = models.ForeignKey(SubStage, on_delete=models.CASCADE)
    ReplaySubStage = models.IntegerField(null='true')

