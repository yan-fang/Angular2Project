define(["angular"],function(e){"use strict";var r=e.module("AtmFinderModule");return r.factory("AtmFinderFactory",["EaseConstantFactory","EASEUtilsFactory","easeExceptionsService","Restangular","$q","EaseConstant","ContentAccountLinks","ContentConstant","AtmFinderConstant",function(e,r,a,t,n,i,o,s,c){var l={},d=function(e,r){this[c.kOmniBoxAddressKey]=e||"",this[c.kSearchRadiusKey]=r||2},m=function(e){var r={};switch(e){case"ATM-Retail":r={markerUrl:l["ease.core.widget.atmfinder.mapMarkerAtmRetail"],listIconUrl:l["ease.core.widget.atmfinder.bankATMIcon"],listAltKey:"ease.core.widget.atmfinder.search.filter.atm1.label"};break;case"Branch":r={markerUrl:l["ease.core.widget.atmfinder.mapMarkerBranch"],listIconUrl:l["ease.core.widget.atmfinder.branchIcon"],listAltKey:"ease.core.widget.atmfinder.search.filter.branches.label"};break;case"CB":r={markerUrl:l["ease.core.widget.atmfinder.mapMarkerCashBack"],listIconUrl:l["ease.core.widget.atmfinder.cashBackIcon"],listAltKey:"ease.core.widget.atmfinder.search.filter.cashback.label"};break;case"ATM-360":r={markerUrl:l["ease.core.widget.atmfinder.mapMarker360"],listIconUrl:l["ease.core.widget.atmfinder.360ATMIcon"],listAltKey:"ease.core.widget.atmfinder.search.filter.atm2.label"}}return r},u=function(e,r){this.locationId="locationId"+r,this.locationType=e.locationType,this.locationIcon=m(e.locationType).listIconUrl,this.locationIconAlt=m(e.locationType).listAltKey,this.name=e.locationName,this.addressLine1=e.address.addressLine1,this.addressLine2=e.address.city+", "+e.address.stateCode+" "+e.address.postalCode,this.mapUrl=c.kMapUrl+this.addressLine1+" "+this.addressLine2,this.telephone=e.telephoneNumber,this.accessHours=e.lobbyHours?e.lobbyHours:e.atmHours,this.services=e.services,this.drawerOpen=!1},k=function(e){var r=[],a=[];e.entries=e.entries||[];for(var t=0;t<e.entries.length;t++){var n="<p style='font-size: 14px'>"+e.entries[t].locationName+"</p><p>"+e.entries[t].address.addressLine1+"</p>";a.push(new u(e.entries[t],t)),r.push({lat:Number(e.entries[t].geoLocation.latitude),"long":Number(e.entries[t].geoLocation.longitude),markerIcon:{url:m(e.entries[t].locationType).markerUrl},markerText:n,eventHandlers:[],eventNames:["mouseover","mouseout","click"],id:"locationId"+t,locationType:e.entries[t].locationType})}var i={lat:Number(e.requestedGeoLocation.latitude),"long":Number(e.requestedGeoLocation.longitude),markerConfig:r,atmListData:a};return i},h=function(o,s){var l=new d(o,s),m=n.defer(),u=i.kAtmFinderUrl;t.setBaseUrl(e.baseUrl());var h=t.all(u);return r.setCustomerActivityHeader("50066"),h.post(l).then(function(e){if(e.easeDisplayError&&e.easeDisplayError.severity)m.reject(e.easeDisplayError);else{var r=k(e);r.searchRadius=l[c.kSearchRadiusKey],m.resolve(r)}},function(e){throw m.reject(),a.createEaseException({module:"AtmModule",message:e.statusText,cause:e})}),m.promise},f=function(e){l=e[s.kCoreFinder],l["ease.core.widget.atmfinder.searchIcon"]=o.urlContent+e[s.kSearchIcon],l["ease.core.widget.atmfinder.clearSearchIcon"]=o.urlContent+e[s.kClearSearchIcon],l["ease.core.widget.atmfinder.noResultsIcon"]=o.urlContent+e[s.kNoResultsIcon],l["ease.core.widget.atmfinder.filterIcon"]=o.urlContent+e[s.kIconFilter],l["ease.core.widget.atmfinder.externalLinkIcon"]=o.urlContent+e[s.kIconExternalLink],l["ease.core.widget.atmfinder.mapMarkerAtmRetail"]=o.urlContent+e[s.kMapMarkerAtmRetail],l["ease.core.widget.atmfinder.mapMarkerAtmRetailLarge"]=o.urlContent+e[s.kMapMarkerAtmRetailLarge],l["ease.core.widget.atmfinder.mapMarkerBranch"]=o.urlContent+e[s.kMapMarkerBranch],l["ease.core.widget.atmfinder.mapMarkerBranchLarge"]=o.urlContent+e[s.kMapMarkerBranchLarge],l["ease.core.widget.atmfinder.mapMarker360"]=o.urlContent+e[s.kMapMarker360],l["ease.core.widget.atmfinder.mapMarker360Large"]=o.urlContent+e[s.kMapMarker360Large],l["ease.core.widget.atmfinder.mapMarkerCashBack"]=o.urlContent+e[s.kMapMarkerCashBack],l["ease.core.widget.atmfinder.mapMarkerCashBackLarge"]=o.urlContent+e[s.kMapMarkerCashBackLarge],l["ease.core.widget.atmfinder.360ATMIcon"]=o.urlContent+e[s.k360ATMIcon],l["ease.core.widget.atmfinder.bankATMIcon"]=o.urlContent+e[s.kBankATMIcon],l["ease.core.widget.atmfinder.cashBackIcon"]=o.urlContent+e[s.kCashBackIcon],l["ease.core.widget.atmfinder.branchIcon"]=o.urlContent+e[s.kBranchIcon]},g=function(){return l};return{getAtmData:h,setAtmDataSet:k,setContentData:f,getContentData:g}}]),r});