from rest_framework import  viewsets
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters

from .Serializer import *


class ExperimentsView(ModelViewSet):
    queryset = Experiment.objects.all().order_by("Number")
    serializer_class = ExperimentSerializer


class StagesFilter(filters.FilterSet):
    Number = filters.NumberFilter()
    Name = filters.CharFilter()
    Experiment = filters.NumberFilter()
    PreparatoryStage = filters.BooleanFilter()

    class Meta:
        model = Stage
        fields = ['Number', 'Name', 'Experiment', 'Risks', 'PreparatoryStage', 'id']


class StagesListView(viewsets.ModelViewSet):
    serializer_class = StageSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = StagesFilter
    def get_queryset(self):
        return Stage.objects.all().order_by("Number")


class EquipmentFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Stage = filters.NumberFilter()

    class Meta:
        model = Equipment
        fields = ['Name', 'Stage', 'id']


class EquipmentListView(viewsets.ModelViewSet):
    serializer_class = EquipmentsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = EquipmentFilter

    def get_queryset(self):
        return Equipment.objects.all()


class DishesFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Stage = filters.NumberFilter()

    class Meta:
        model = Dishes
        fields = ['Name', 'Stage', 'id']


class DishesListView(viewsets.ModelViewSet):
    serializer_class = DishesSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = DishesFilter

    def get_queryset(self):
        return Dishes.objects.all()


class ReagentsFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Stage = filters.NumberFilter()

    class Meta:
        model = Reagents
        fields = ['Name', 'Stage', 'id']


class ReagentsListView(viewsets.ModelViewSet):
    serializer_class = ReagentsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ReagentsFilter

    def get_queryset(self):
        return Reagents.objects.all()


class ParagraphsFilter(filters.FilterSet):
    Stage = filters.NumberFilter()

    class Meta:
        model = Paragraph
        fields = ['Stage']


class ParagraphsListView(viewsets.ModelViewSet):
    serializer_class = ParagraphsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ParagraphsFilter

    def get_queryset(self):
        return Paragraph.objects.all()


class ParametersFilter(filters.FilterSet):
    SubStage = filters.NumberFilter()
    MainStage = filters.NumberFilter()

    class Meta:
        model = Parameter
        fields = ['SubStage', 'MainStage']


class ParametersListView(viewsets.ModelViewSet):
    serializer_class = ParametersSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ParametersFilter

    def get_queryset(self):
        return Parameter.objects.all()


class CalcParametersFilter(filters.FilterSet):
    SubStage = filters.NumberFilter()
    MainStage = filters.NumberFilter()

    class Meta:
        model = CalcParameter
        fields = ['SubStage', 'MainStage']


class CalcParametersListView(viewsets.ModelViewSet):
    serializer_class = CalcParametersSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CalcParametersFilter

    def get_queryset(self):
        return CalcParameter.objects.all()


class DocsFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Stage = filters.NumberFilter()

    class Meta:
        model = Doc
        fields = ['Name', 'Stage', 'id']


class DocsListView(viewsets.ModelViewSet):
    serializer_class = DocsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = DocsFilter

    def get_queryset(self):
        Docs = Doc.objects.all()
        return Docs


class ProtectiveEquipmentsFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Stage = filters.NumberFilter()

    class Meta:
        model = ProtectiveEquipment
        fields = ['Name', 'Stage', 'id']


class ProtectiveEquipmentsListView(viewsets.ModelViewSet):
    serializer_class = ProtectiveEquipmentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProtectiveEquipmentsFilter

    def get_queryset(self):
        return ProtectiveEquipment.objects.all()


class SubStagesFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Main = filters.NumberFilter()
    Parent = filters.NumberFilter()
    OtherOption = filters.BooleanFilter()

    class Meta:
        model = SubStage
        fields = ["id", 'Name', "Number", "Main", "Parent", "OtherOption"]


class SubStagesListView(viewsets.ModelViewSet):
    serializer_class = SubStageSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SubStagesFilter

    def get_queryset(self):
        return SubStage.objects.all().order_by("Number")


class CriterionsFilter(filters.FilterSet):
    id = filters.NumberFilter()
    Name = filters.CharFilter()
    Stage = filters.NumberFilter()
    class Meta:
        model = Criterion
        fields = '__all__'


class CriterionsListView(viewsets.ModelViewSet):
    serializer_class = CriterionsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CriterionsFilter

    def get_queryset(self):
        return Criterion.objects.all()


class ReplayFilter(filters.FilterSet):
    id = filters.NumberFilter()
    MainStage = filters.NumberFilter()
    SubStage = filters.NumberFilter()
    ReplaySubStage = filters.NumberFilter()
    class Meta:
        model = Replay
        fields = '__all__'


class ReplayListView(viewsets.ModelViewSet):
    serializer_class = ReplaySerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ReplayFilter

    def get_queryset(self):
        return Replay.objects.all()
