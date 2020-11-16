from django_filters import rest_framework as filters

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from lab.Serializer import *


class ExeEquipmentFilter(filters.FilterSet):
    Check = filters.BooleanFilter()
    Name = filters.CharFilter()
    ExeStage = filters.NumberFilter()

    class Meta:
        model = ExeEquipment
        fields = ['Check', 'Name', 'ExeStage']


class ExeEquipmentListView(viewsets.ModelViewSet):
    serializer_class = ExeEquipmentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeEquipmentFilter

    def get_queryset(self):
        return ExeEquipment.objects.all()


class ExeDishesFilter(filters.FilterSet):
    Check = filters.BooleanFilter()
    Name = filters.CharFilter()
    ExeStage = filters.NumberFilter()

    class Meta:
        model = ExeDishes
        fields = ['Check', 'Name', 'ExeStage']


class ExeDishesListView(viewsets.ModelViewSet):
    serializer_class = ExeDishesSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeDishesFilter

    def get_queryset(self):
        return ExeDishes.objects.all()


class ExeReagentsFilter(filters.FilterSet):
    Check = filters.BooleanFilter()
    Name = filters.CharFilter()
    ExeStage = filters.NumberFilter()

    class Meta:
        model = ExeReagents
        fields = ['Check', 'Name', 'ExeStage']


class ExeReagentsListView(viewsets.ModelViewSet):
    serializer_class = ExeReagentsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeReagentsFilter

    def get_queryset(self):
        return ExeReagents.objects.all()


class ExeProtectiveEquipmentFilter(filters.FilterSet):
    Check = filters.BooleanFilter()
    Name = filters.CharFilter()
    ExeStage = filters.NumberFilter()

    class Meta:
        model = ExeProtectiveEquipment
        fields = ['Check', 'Name', 'ExeStage']


class ExeProtectiveEquipmentListView(viewsets.ModelViewSet):
    serializer_class = ExeProtectiveEquipmentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeProtectiveEquipmentFilter

    def get_queryset(self):
        return ExeProtectiveEquipment.objects.all()


class ExeDocFilter(filters.FilterSet):
    Check = filters.BooleanFilter()
    Name = filters.CharFilter()
    ExeStage = filters.NumberFilter()

    class Meta:
        model = ExeDoc
        fields = ['Check', 'Name', 'ExeStage']


class ExeDocListView(viewsets.ModelViewSet):
    serializer_class = ExeDocSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeDocFilter

    def get_queryset(self):
        return ExeDoc.objects.all()


class ExeStagesFilter(filters.FilterSet):
    Check = filters.BooleanFilter()
    Name = filters.CharFilter()
    ExeExperiment = filters.NumberFilter()
    PreparatoryStage = filters.BooleanFilter()

    class Meta:
        model = ExeStage
        fields = ['id', 'Check', 'Name', 'ExeExperiment', 'PreparatoryStage']


class ExeStagesListView(viewsets.ModelViewSet):
    serializer_class = ExeStageSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeStagesFilter

    def get_queryset(self):
        return ExeStage.objects.all().order_by('Number')


class ExeExperimentsFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Samples = filters.NumberFilter()
    Laboratorian = filters.NumberFilter()
    Experiments = filters.NumberFilter()

    class Meta:
        model = ExeExperiment
        fields = ['id', 'Samples', 'Laboratorian', 'Experiments']


class ExeExperimentsListView(viewsets.ModelViewSet):
    serializer_class = ExeExperimentsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeExperimentsFilter

    def get_queryset(self):
        return ExeExperiment.objects.all()


class ExeParagraphFilter(filters.FilterSet):
    ExePreparatoryStageName = filters.CharFilter()
    ExePreparatoryStage = filters.NumberFilter()
    Name = filters.CharFilter()
    ExeStage = filters.NumberFilter()

    class Meta:
        model = ExeParagraph
        fields = ['ExeStage', 'Name', 'ExePreparatoryStage', 'ExePreparatoryStageName']


class ExeParagraphListView(viewsets.ModelViewSet):
    serializer_class = ExeParagraphSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeParagraphFilter

    def get_queryset(self):
        return ExeParagraph.objects.all()


class ExeSubStagesFilter(filters.FilterSet):
    Number = filters.NumberFilter()
    Check = filters.BooleanFilter()
    Name = filters.CharFilter()
    ExeStage = filters.NumberFilter()

    class Meta:
        model = ExeSubStage
        fields = ['id', 'Check', 'Name', 'ExeStage', 'Number']


class ExeSubStagesListView(viewsets.ModelViewSet):
    serializer_class = ExeSubStageSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeSubStagesFilter

    def get_queryset(self):
        return ExeSubStage.objects.all().order_by("Number")


class SamplesFilter(filters.FilterSet):
    Laboratorian = filters.NumberFilter()
    ExeExperiment = filters.NumberFilter()

    class Meta:
        model = Samples
        fields = ['Laboratorian', 'ExeExperiment']


class SamplesListView(viewsets.ModelViewSet):
    serializer_class = SamplesSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SamplesFilter

    def get_queryset(self):
        return Samples.objects.all()


class ExeParametersFilter(filters.FilterSet):
    ExeSubStage = filters.NumberFilter()
    ExeMainStage = filters.NumberFilter()

    class Meta:
        model = ExeParameter
        fields = ['ExeSubStage', 'ExeMainStage']


class ExeParametersListView(viewsets.ModelViewSet):
    serializer_class = ExeParametersSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeParametersFilter

    def get_queryset(self):
        return ExeParameter.objects.all()


class ExeCalcParametersFilter(filters.FilterSet):
    ExeSubStage = filters.NumberFilter()
    ExeMainStage = filters.NumberFilter()

    class Meta:
        model = ExeCalcParameter
        fields = ['ExeSubStage', 'ExeMainStage']


class ExeCalcParametersListView(viewsets.ModelViewSet):
    serializer_class = ExeCalcParametersSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeCalcParametersFilter

    def get_queryset(self):
        return ExeCalcParameter.objects.all()


class ExeCriterionsFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Stage = filters.NumberFilter()
    Answer = filters.BooleanFilter()
    class Meta:
        model = ExeCriterion
        fields = '__all__'


class ExeCriterionsListView(viewsets.ModelViewSet):
    serializer_class = ExeCriterionsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeCriterionsFilter

    def get_queryset(self):
        return ExeCriterion.objects.all()


class ExeReplayFilter(filters.FilterSet):
    MainStage = filters.NumberFilter()
    ExeSubStage = filters.NumberFilter()
    ReplaySubStage = filters.NumberFilter()
    class Meta:
        model = ExeReplay
        fields = '__all__'


class ExeReplayListView(viewsets.ModelViewSet):
    serializer_class = ExeReplaySerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ExeReplayFilter

    def get_queryset(self):
        return ExeReplay.objects.all()