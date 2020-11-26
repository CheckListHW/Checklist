from django.contrib import admin
from django.urls import path
from rest_framework.routers import SimpleRouter

from home import Filters as EditorsFilters
from lab import Filters as LaoratorianFilters
from Customer import Filters as CustomerFilters

from home import views as EditorsViews
from lab import views as LaoratorianViews
from Customer import views as CustomerViews

router = SimpleRouter()
router.register('api/exp', EditorsFilters.ExperimentsView)
router.register('api/stage', EditorsFilters.StagesListView, basename='StageList')
router.register('api/stuffs/equipment', EditorsFilters.EquipmentListView, basename='DocList')
router.register('api/stuffs/dishes', EditorsFilters.DishesListView, basename='DocList')
router.register('api/stuffs/reagents', EditorsFilters.ReagentsListView, basename='DocList')
router.register('api/stuffs/docs', EditorsFilters.DocsListView, basename='DocList')
router.register('api/stuffs/protectiveEquipment', EditorsFilters.ProtectiveEquipmentsListView, basename='DocList')
router.register('api/paragraphs', EditorsFilters.ParagraphsListView, basename='ParagraphsList')
router.register('api/parameters', EditorsFilters.ParametersListView, basename='ParametersList')
router.register('api/calcparameters', EditorsFilters.CalcParametersListView, basename='CalcParametersList')
router.register('api/substage', EditorsFilters.SubStagesListView, basename='SubStageList')
router.register('api/criterion', EditorsFilters.CriterionsListView, basename='CriterionsList')
router.register('api/replay', EditorsFilters.ReplayListView, basename='replayList')

router.register('api/exestage', LaoratorianFilters.ExeStagesListView, basename='ExeStageList')
router.register('api/exeexperiment', LaoratorianFilters.ExeExperimentsListView, basename='ExeУxperimentLisе')
router.register('api/exesubstage', LaoratorianFilters.ExeSubStagesListView, basename='ExeSubStageList')
router.register('api/exeparagraph', LaoratorianFilters.ExeParagraphListView, basename='ExeParagraphList')
router.register('api/exeequipment', LaoratorianFilters.ExeEquipmentListView, basename='ExeEquipmentList')
router.register('api/exedishes', LaoratorianFilters.ExeDishesListView, basename='ExeDishesList')
router.register('api/exereagents', LaoratorianFilters.ExeReagentsListView, basename='ExeReagentsList')
router.register('api/exeprotectiveequipments', LaoratorianFilters.ExeProtectiveEquipmentListView,
                basename='ExeProtectiveEquipmentList')
router.register('api/exedocs', LaoratorianFilters.ExeDocListView, basename='ExeDocList')
router.register('api/samples', LaoratorianFilters.SamplesListView, basename='SamplesList')
router.register('api/exeparameters', LaoratorianFilters.ExeParametersListView, basename='ExeParametersList')
router.register('api/execalcparameters', LaoratorianFilters.ExeCalcParametersListView, basename='ExeCalcParametersList')
router.register('api/execriterion', LaoratorianFilters.ExeCriterionsListView, basename='ExeCriterionsList')
router.register('api/exereplay', LaoratorianFilters.ExeReplayListView, basename='ExeEeplayList')

urlpatterns = [
    path('', EditorsViews.Start),
    path('home/', EditorsViews.experiments),
    path('logout/', EditorsViews.LogoutView),
    path('stages/', EditorsViews.stages),
    path('stages/crud/', EditorsViews.stagescrud),
    path('stages/preparatory/', EditorsViews.preparatory),
    path('stages/preparatory/crud/', EditorsViews.preparatorycrud),
    path('stages/minicheckprepare/', EditorsViews.minicheckprepare),
    path('stages/minicheckprepare/crud/', EditorsViews.minicheckpreparecrud),
    path('experiments/', EditorsViews.experiments),
    path('delexperiments/', EditorsViews.delexperiments),
    path('stages/stuffs/', EditorsViews.stuffsstage),
    path('stages/stuffs/crud/', EditorsViews.stuffscrud),
    path('stages/sub/', EditorsViews.substages, name='substages'),
    path('stages/sub/crud/', EditorsViews.substagescrud),
    path('lab/home/', LaoratorianViews.selectsample),
    path('lab/sample/', LaoratorianViews.sample),
    path('lab/sample/select/', LaoratorianViews.selectsample),
    path('lab/stages/', LaoratorianViews.stages),
    path('lab/stuffs/', LaoratorianViews.stuffs),
    path('lab/preparatory/', LaoratorianViews.preparatory),
    path('lab/preparatory/crud/', LaoratorianViews.preparatorycrud),
    path('lab/check/', LaoratorianViews.check),
    path('lab/check/crud/', LaoratorianViews.checkcrud),
    path('customer/samples/', CustomerViews.selectsample),
    path('customer/infosample/', CustomerViews.InfoSample),
    path('admin/', admin.site.urls),
]

urlpatterns += router.urls
