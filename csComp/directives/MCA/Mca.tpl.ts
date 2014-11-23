module Mca { export var html = '<div>    <h4 class="leftpanel-header">MCA</h4>    <div>        <select data-ng-model="vm.mca"                data-ng-options="mca.title for mca in vm.availableMcas"                style="width: 85%; margin-bottom:10px;"></select>        <a href="" data-ng-click="showDialog=!showDialog" class="pull-right" style="margin:0 10px;"><i class="fa fa-plus"></i></a>    </div>        <!--MCA EDITOR DIALOG-->    <div id="mcaEditorView">        <!--<input type="checkbox" ng-model="showDialog"> Show-->        <div show-modal="showDialog" class="modal fade">            <div class="modal-dialog" data-ng-controller="mcaEditorCtrl">                <div class="modal-content">                    <div class="modal-header">                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>                        <h3 class="modal-title">MCA Editor</h3>                    </div>                    <div class="modal-body">                        <input type="text" data-ng-model="vm.mcaTitle" placeholder="MCA title..." />                        <span><input type="checkbox" data-ng-model="vm.hasRank" style="margin-left: 10px;" />&nbsp;&nbsp;Include rank</span>                        <input type="text" data-ng-if="vm.hasRank" data-ng-model="vm.rankTitle" placeholder="Rank title..." />                        <h4>Select the main feature</h4>                        <select data-ng-model="vm.selectedFeatureType"                                data-ng-change="vm.loadPropertyTypes()"                                data-ng-options="item as item.name for (key, item) in vm.dataset.poiTypes"                                class="form-control tt-input"></select>                        <h4>Select the properties</h4>                        <ul class="form-group" style="margin-top: 1em; margin-left: -2em; overflow-y: auto; overflow-x: hidden;"                            resize resize-y="450">                            <li ng-repeat="mi in vm.metaInfos" class="list-unstyled" style="white-space: nowrap; text-overflow: ellipsis">                                <div>                                    <span>                                        <input type="checkbox" name="vm.selectedTitles[]" value="{{mi.title}}"                                               data-ng-checked="mi.isSelected"                                               data-ng-click="mi.isSelected = !mi.isSelected">&nbsp;&nbsp;{{mi.title}}                                        <span data-ng-if="mi.isSelected" style="margin-left: 10px;">                                            <input type="checkbox" data-ng-model="specifyCategory" /><span>&nbsp;&nbsp;Use category:&nbsp;</span>                                            <input type="text" data-ng-if="specifyCategory" data-ng-model="mi.category" placeholder="..." />                                        </span>                                    </span>                                    <form data-ng-if="mi.isSelected" name="myForm" style="margin-left: 20px;">                                        <label id="scoringFunctions" data-ng-repeat="sf in vm.scoringFunctions">                                            <input type="radio" data-ng-model="mi.scoringFunctionType" value="{{sf.type}}">                                            <a data-ng-href="" data-ng-class="sf.cssClass" data-ng-click="mi.isSelected = !mi.isSelected"></a>                                        </label>                                    </form>                                    <div data-ng-if="mi.scoringFunctionType == 0" style="margin-left: 20px;">                                        input -> score:&nbsp;<input type="text" data-ng-model="mi.scores" placeholder="[x0,y0 x1,y1 ...]" />                                    </div>                                </div>                            </li>                        </ul>                    </div>                    <div class="modal-footer">                        <button type="button" class="btn btn-warning" data-dismiss="modal" data-ng-click="vm.cancel()">Cancel</button>                        <button type="button" class="btn btn-primary" data-dismiss="modal" data-ng-disabled="vm.isDisabled()" data-ng-click="vm.save()">OK</button>                    </div>                </div><!-- /.modal-content -->            </div><!-- /.modal-dialog -->        </div>    </div>    <div data-ng-if="vm.mca">        <ul class="list-unstyled">            <li data-ng-repeat="criterion in vm.mca.criteria">                <div data-ng-style="{\'display\': \'inline-block\', \'width\':\'10px\', \'height\':\'10px\', \'border\':\'solid 1px black\', \'background-color\': criterion.color}">                </div>                <div style="display: inline-block;">{{criterion.getTitle() | limitTo: 22}}</div>                <rating class="pull-right" style="margin:0 10px;" ng-model="criterion.userWeight" max="{{vm.mca.userWeightMax}}" readonly="isReadonly"                        state-on="\'fa fa-circle\'" state-off="\'fa fa-circle-o\'"                        data-ng-click="vm.weightUpdated(criterion)"                        on-hover="hoveringOver(value)" on-leave="overStar = null"></rating>                <ul class="list-unstyled" style="margin-left: 10px;" data-ng-if="criterion.criteria.length > 0">                    <li data-ng-repeat="crit in criterion.criteria">                        <div data-ng-style="{\'display\': \'inline-block\', \'width\':\'10px\', \'height\':\'10px\', \'border\':\'solid 1px black\', \'background-color\': crit.color}">                        </div>                        <div style="display: inline-block;">{{crit.getTitle() | limitTo: 20}}</div>                        <rating class="pull-right" style="margin:0 10px;" ng-model="crit.userWeight" max="{{vm.mca.userWeightMax}}" readonly="isReadonly"                                state-on="\'fa fa-circle\'" state-off="\'fa fa-circle-o\'"                                data-ng-click="vm.weightUpdated(crit)"                                on-hover="hoveringOver(value)" on-leave="overStar = null"></rating>                    </li>                </ul>            </li>        </ul>        <!--<a href="" style="display: inline-block; width: 100%; text-transform: uppercase"           data-ng-click="vm.calculateMca()" translate="MCA_COMPUTE_MGS" translate-values="{ mcaTitle: vm.mca.title }"></a>-->        <div style="margin-top: 5px; margin-left: 70px;" id="mcaPieChart"></div>        <div data-ng-if="vm.showFeature">            <h4>{{vm.selectedFeature.properties[\'Name\']}}</h4>            <table class="table table-condensed">                <tr data-ng-repeat="item in vm.properties"                    popover="{{item.description}}"                    popover-placement="right"                    popover-trigger="mouseenter"                    popover-append-to-body="true">                    <td><a class="fa fa-filter makeNarrow" data-ng-if="item.canFilter" data-ng-click="vm.$layerService.setFilter(item)" style="cursor: pointer"></a></td>                    <td><a class="fa fa-eye makeNarrow" data-ng-if="item.canStyle" data-ng-click="vm.setStyle(item)" style="cursor: pointer"></a></td>                    <td>{{item.key}}</td>                    <td class="text-right">{{item.value}}</td>                </tr>            </table>        </div>        <i data-ng-if="!vm.showFeature"><div translate="SHOW_FEATURE_MSG"></div></i>    </div></div>'; }