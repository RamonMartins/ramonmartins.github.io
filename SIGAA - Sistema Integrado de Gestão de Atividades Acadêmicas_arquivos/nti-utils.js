//função anonima
function initNtiUtils(){
	console.log('initNtiUtils');
	try {
		//Funcionalidades auxiliares para eliminar necessidade do jQuery
		var escapeElem = document.createElement('textarea');
		function escapeHTML(html) {
		    escapeElem.textContent = html;
		    return escapeElem.innerHTML;
		}
		function unescapeHTML(html) {
		    escapeElem.innerHTML = html;
		    return escapeElem.textContent;
		}
		function replaceAll(str, search, replacement) {
		    return str.replace(new RegExp(search, 'g'), replacement);
		}
		function collectionHas(a, b) { //helper function (see below)
		    for(var i = 0, len = a.length; i < len; i ++) {
		        if(a[i] == b) return true;
		    }
		    return false;
		}
		function findParentBySelector(elm, selector) {
		    var all = document.querySelectorAll(selector);
		    var cur = elm.parentNode;
		    while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
		        cur = cur.parentNode; //go up
		    }
		    return cur; //will return null if not found
		}
		var extractTextTab = function(s) {
			var sourceCode = document.getElementsByTagName('html')[0].innerHTML;
			var rex = new RegExp('addTab.*' + s + '.*[\"|\'](.*)[\"|\']\\)\;', 'gi');
			var match = rex.exec(sourceCode);
			return replaceAll(unescapeHTML(match !== null ? match[1].trim() : s),'\"','').replace('>','').replace('</span>','').trim();
		}
		var textBeforeEnter = function(s) {
			var re = /(.*)\n.*/g;
			return s.replace(re, '$1');
		}
		var camelize = function(str) {
			var newstr =  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
		    	if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
		    	return index == 0 ? match.toLowerCase() : match.toUpperCase();
		  	});
		  	return newstr.substr( 0, 1 ).toUpperCase() + newstr.substr( 1 );
		}
		var boldTextIndexOf = function(str, idx, size) {
			return str.substr(0,idx) + "<b>" + str.substr(idx,size) + "</b>" + str.substr(idx + size);
		}
		window.readyHandlers = [];
		window.ready = function ready(handler) {
		  window.readyHandlers.push(handler);
		  handleState();
		};
		window.handleState = function handleState () {
		  if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
		    while(window.readyHandlers.length > 0) {
		      (window.readyHandlers.shift())();
		    }
		  }
		};
		document.onreadystatechange = window.handleState;
		function removerAcentos( newStringComAcento ) {
		  	var string = newStringComAcento;
			var mapaAcentosHex 	= {
				a : /[\xE0-\xE6]/g,
				A : /[\xC0-\xC6]/g,
				e : /[\xE8-\xEB]/g,
				E : /[\xC8-\xCB]/g,
				i : /[\xEC-\xEF]/g,
				I : /[\xCC-\xCF]/g,
				o : /[\xF2-\xF6]/g,
				O : /[\xD2-\xD6]/g,
				u : /[\xF9-\xFC]/g,
				U : /[\xD9-\xDC]/g,
				c : /\xE7/g,
				C : /\xC7/g,
				n : /\xF1/g,
				N : /\xD1/g,
			};

			for ( var letra in mapaAcentosHex ) {
				var expressaoRegular = mapaAcentosHex[letra];
				string = string.replace( expressaoRegular, letra );
			}

			return string;
		}		

		//----- INICIO GESTOR -----//

		//Preparar elemento pai que vai receber os novos componentes
		var elemTabSubSistemas = document.getElementById('operacoes-subsistema');
		var elemDivParent = document.createElement('div');
		elemDivParent.id = 'nti-utils-search-div';

		//Se for onde há abas no sistema
		if (elemTabSubSistemas != null) {
		//if (elemTabSubSistemas != null) {

			//Template da barra renderizada
			elemTabSubSistemas.insertBefore(elemDivParent, document.querySelectorAll('.ytab-wrap')[0]);
			elemDivParent.innerHTML = '<div class="nti-utils-box"><div class="nti-row"><div class="nti-span-2"><label for="auxSigFuncionalidade">Buscar Funcionalidade:</label></div><div class="nti-span-10"><input id="auxSigFuncionalidade" type="text" autocomplete="off" /><span class="nti-utils-close">&#215;</span></div></div><div class="nti-row"><ul id="auxListFuncionalidades"></ul><div id="auxInformacoes"></div></div>';

			//Novas Funcionalidades
			var findFuncById = function(id) {
				for (var f in funcSIG) {
					if (funcSIG[f].id == id) {
						return funcSIG[f];
					}
				}
				return null;
			}
			var findTabElemByDesc = function(desc) {
				for (var t in abasSIG) {
					if (abasSIG[t].abaDescricaoStr == desc) {
						return abasSIG[t].abaElem;
					}
				}
				return null;
			}
			var normalizeTabName = function(str) {
				return str.replace(/\s/g, '').replace(/\"/g, '').toUpperCase();
			}
			var atualizaInfos = function(val) {
				var funcs = "", count = 0;
				var elemFuncs = document.getElementById('auxListFuncionalidades'),
					elemInfos = document.getElementById('auxInformacoes');

				//funcionalidades
				elemFuncs.innerHTML = "";
				if (val.length > 0) {
					for (var f in funcSIG) {
						if (typeof(funcSIG[f]) == 'object') {
							var pathStr = funcSIG[f].abaDescricao + " > " + funcSIG[f].submenu;
							var pathSearch = funcSIG[f].abaDescricaoSearch + " > " + funcSIG[f].submenuSearch;
							var valUpper = removerAcentos(val.toUpperCase()),
								descStr = funcSIG[f].descricao,
								descIdx = funcSIG[f].descricaoSearch.toUpperCase().indexOf(valUpper),
								pathIdx = pathSearch.toUpperCase().indexOf(valUpper);			

							if (descIdx != -1 || pathIdx != -1) {
								count++;
								funcs += '<li><a href="#" class="nti-utils-func" data-nti-func-id="' + funcSIG[f].id + '" data-nti-func-click="' + funcSIG[f].elem.getAttribute('onclick') + '">';
								funcs += descIdx != -1 ? boldTextIndexOf(descStr, descIdx, val.length) : descStr;
								funcs += "<span>";
								funcs += pathIdx != -1 ? boldTextIndexOf(pathStr, pathIdx, val.length) : pathStr;
								funcs += '</span><button class="nti-utils-func-aba">Acessar Funcionalidade</button><div class="nti-clear-both"></div>';
								funcs += "</a></li>";
							}
						}
					}
					//renderizar opções
					elemFuncs.innerHTML = funcs;
				}
				//informações
				elemInfos.innerHTML = "<b>Total:</b> " + funcSIG.length + " / <b>Encontrados:</b> " + count;
			}
			var descHeaderRichTabPanel = function(element, headerObj) {
				var richTabPanelContent = findParentBySelector(element, '.rich-tabpanel-content-position');
				if (richTabPanelContent) {
					var tdAtual = richTabPanelContent.parentNode;
					var tdsRichTab = tdAtual.parentNode.children;
					var idx = -1;
					for (var i = 0; i < tdsRichTab.length; i++) {
						if (tdsRichTab[i].tagName == tdAtual.tagName &&
								tdsRichTab[i].id == tdAtual.id) {
							idx = i;
						}
					}
					if (idx != -1) {
						var richTabPanel = findParentBySelector(element, '.rich-tabpanel');
						var cells = richTabPanel.querySelectorAll("[class^='rich-tabhdr-cell']");
						var headerEl = cells[idx].querySelector(".rich-tab-header");
						
						if (headerObj) {
							headerObj.text = headerEl.innerHTML + " > " + headerObj.text;
							headerObj.elems.push(headerEl);
						} else {
							headerObj = {
								text: headerEl.innerHTML,
								elems: [headerEl]
							}
						}
						
						return descHeaderRichTabPanel(richTabPanel, headerObj);
					}
				}
				return headerObj;
			}
			//Busca por informações na página
			var showFunc = function(id) {
				var func = findFuncById(id);

				//remover todos os outros elementos com a classe
				document.querySelectorAll('.nti-utils-find-func').forEach(function(element) {
					element.classList.remove('nti-utils-find-func');
				});

				//realizar alteração de aba
				func.abaElem.click();
				
				//Com prazo de conclusão no semestre atual
				for (var f in func.headerElems) {
					if (typeof func.headerElems[f] == 'object' && func.headerElems[f].click) {
						func.headerElems[f].click();
					}
				}
				
				//adicionar classe ao novo elemento
				func.elem.classList.add('nti-utils-find-func');
			}

			var funcSIG = [], abasSIG = [];
			ready(function(){
				var clickSimulateElem = document.createElement('a');
				document.body.insertBefore(clickSimulateElem, document.body.childNodes[0]);

				document.querySelectorAll('.nti-utils-close').forEach(function(element) {
					element.addEventListener('click',function(e){
						console.log('maoe', elemDivParent)
						e.preventDefault();
						e.stopPropagation();
						document.getElementById('nti-utils-search-div').style.display = "none";
					});
				});
				
				//Popular array de abas
				document.querySelectorAll('.ytab-text').forEach(function(element) {
					abasSIG.push({
						abaDescricao: element.innerHTML,
						abaDescricaoStr: element.innerText.trim(),
						abaDescricaoNorm: normalizeTabName(element.innerHTML),
						abaElem: findParentBySelector(element, '.ytab-right')
					});
				});

				//Popular array de funcionalidades
				document.querySelectorAll('#operacoes-subsistema a').forEach(function(element, index) {
					//verificar se não é aba e se possui alguma ação no click
					if (!element.classList.contains('ytab-right') && 
						(element.hasAttribute('onclick') || element.getAttribute('href') != '#')) {
						var elemAba = findParentBySelector(element, '.aba');
						var idAba = elemAba.getAttribute('id');
						var abaDesc = extractTextTab(idAba);
						var headerObj = descHeaderRichTabPanel(element);
						var submenu = textBeforeEnter(element.parentNode.parentNode.parentNode.innerHTML);
						var abaElem = findTabElemByDesc(abaDesc);

						headerObj = headerObj ? headerObj : { text: '', elems: [] };
						submenu = headerObj.text ? headerObj.text + " > " + submenu : submenu;

						var descricao = element.innerHTML.toUpperCase();
						funcSIG.push({
							id: funcSIG.length,
							aba: camelize(idAba),
							abaDescricao: abaDesc,
							descricao: descricao,
							submenu: submenu,
							elem: element,
							abaElem: abaElem,
							headerElems: headerObj.elems,

							descricaoSearch: removerAcentos(descricao),
							abaDescricaoSearch: removerAcentos(abaDesc),
							submenuSearch: removerAcentos(submenu)
						});

					}
					
				});

				//Ordenar Funcionalidades pela descricao
				funcSIG.sort(function(a, b) { 
				    return ((a.descricao < b.descricao) ? -1 : ((a.descricao > b.descricao) ? 1 : 0))
				});

				//Eventos que atualizam dados
				document.getElementById("auxSigFuncionalidade").addEventListener('keyup', function (e){
					//console.log(this.value)
					atualizaInfos(this.value);
				});

				//Click para visualizar aba da funcionalidade
				document.addEventListener('click',function(e){
					if (e.target) {
						//if (e.target.id == 'brnPrepend') { }

						//Ir para a aba
						if (e.target.classList.contains('nti-utils-func-aba')) {
							e.preventDefault();
							e.stopPropagation();
							
							var ntiClick = e.target.parentNode.getAttribute('data-nti-func-click');
							ntiClick = "var fx = function() { " + ntiClick + "}; fx();";
							eval(ntiClick);
						}

						//Ir para a funcionalidade
						if (e.target.classList.contains('nti-utils-func')) {
							e.preventDefault();
							e.stopPropagation();
							showFunc(e.target.getAttribute('data-nti-func-id'));
						}

						//Para textos alterados internos ao elemento da funcionalidade
						if (e.target.tagName.toUpperCase() == 'SPAN' ||
								e.target.tagName.toUpperCase() == 'B') {
							var elemFuncA = findParentBySelector(e.target, '.nti-utils-func');
							if (elemFuncA) {
								e.preventDefault();
								e.stopPropagation();
								showFunc(elemFuncA.getAttribute('data-nti-func-id'));
							}					
						}
					}
				});

				//Inicializa
				atualizaInfos("");
			});

		}

		//----- INICIO PORTAL -----//

		//Preparar elemento pai que vai receber os novos componentes
		var elemMenuDropdown = document.getElementById('menu-dropdown');
		var elemNoticiasPortal = document.getElementById('noticias-portal');

		var elemDivParent = document.createElement('div');
		elemDivParent.id = 'nti-utils-search-div';

		//Se for onde há abas no sistema
		if (elemMenuDropdown != null && elemNoticiasPortal != null) {
			
			//Template da barra renderizada
			elemNoticiasPortal.parentNode.prepend(elemDivParent);
			elemDivParent.innerHTML = '<div class="nti-utils-box"><div class="nti-row"><div class="nti-span-3"><label for="auxSigFuncionalidade">Buscar Funcionalidade:</label></div><div class="nti-span-9"><input id="auxSigFuncionalidade" type="text" autocomplete="off" /><span class="nti-utils-close">&#215;</span></div></div><div class="nti-row"><ul id="auxListFuncionalidades" class="nti-portal"></ul><div id="auxInformacoes"></div></div>';


			var menuTabs = [];
			var menuFolders = [];
			var menuItems = [];

			function execMenuItem(element) {
				element.onmouseover();
				element.onmousedown();
				element.onmouseup();
			}
			function findMenuText(element, clazz) {
				for (var c in element.children) {
					var el = element.children[c];
					if (typeof el == 'object' && el.getAttribute('class') == clazz) {
						return el.innerHTML;
					}
				}
				return '';
			}
			function findSubMenuID(element) {
				return /cmSubMenuID\d*/g.exec(element.getAttribute('onmouseover'));
			}
			function searchFolderOrTab(id, isFolder) {
				var folder = null, arr = isFolder ? menuFolders : menuTabs;
				for (var f in arr) {
					if (arr[f].id == id) {
						folder = arr[f];
					}
				}
				return folder;
			}
			function mountPath(subMenuId) {
				var path = "";
				var folderTabId = null;
				var folder = searchFolderOrTab(subMenuId, true);
				do {
					if (folder) {
						folderTabId = folder.tabId;
						path = ' > ' + folder.descFolder + path;
						folder = searchFolderOrTab(folder.tabId, true);
					}
				} while (folder)
				tab = searchFolderOrTab(folderTabId ? folderTabId : subMenuId, false);
				path = (tab ? tab.descTab : '') + path;
				return path;
			}

			var renderFunctionsDropDown = function(val) {
				var funcs = "", count = 0;
				var elemFuncs = document.getElementById('auxListFuncionalidades'),
					elemInfos = document.getElementById('auxInformacoes');

				//funcionalidades
				elemFuncs.innerHTML = "";
				if (val.length > 0) {
					for (var f in menuItems) {
						if (typeof(menuItems[f]) == 'object') {
							var valUpper = removerAcentos(val.toUpperCase()),
								descStr = menuItems[f].descFunc,
								pathStr = menuItems[f].path,
								descIdx = menuItems[f].descFuncSearch.toUpperCase().indexOf(valUpper),
								pathIdx = menuItems[f].pathSearch.toUpperCase().indexOf(valUpper);			

							if (descIdx != -1 || pathIdx != -1) {
								count++;
								funcs += '<li><a href="#" class="nti-utils-func" data-nti-func-id="' + menuItems[f].id + '">';
								funcs += descIdx != -1 ? boldTextIndexOf(descStr, descIdx, val.length) : descStr;
								funcs += "<span>";
								funcs += pathIdx != -1 ? boldTextIndexOf(pathStr, pathIdx, val.length) : pathStr;
								funcs += "</a></li>";
							}
						}
					}
					//renderizar opções
					elemFuncs.innerHTML = funcs;
				}
				//informações
				elemInfos.innerHTML = "<b>Total:</b> " + menuItems.length + " / <b>Encontrados:</b> " + count;
			}

			document.querySelectorAll('.ThemeOfficeMenu .ThemeOfficeMainItem').forEach(function(element) {
				var descTab = findMenuText(element, 'ThemeOfficeMainFolderText');
				var match = findSubMenuID(element);
				if (match) {
					menuTabs.push({
						descTab: descTab,
						id: match[0]
					});
				}
			});

			document.querySelectorAll('.ThemeOfficeMenuItem').forEach(function(element) {
				var descFolder = findMenuText(element, 'ThemeOfficeMenuFolderText');
				if (descFolder) {
					var match = findSubMenuID(element);
					var subMenu = findParentBySelector(element, '.ThemeOfficeSubMenu');
					menuFolders.push({
						id: match[0],
						tabId: subMenu.id,
						descFolder: descFolder
					});
				}
			});

			var idSeq = 0;
			document.querySelectorAll('.ThemeOfficeMenuItem').forEach(function(element) {
				var descFunc = findMenuText(element, 'ThemeOfficeMenuItemText');
				if (descFunc) {
					var subMenu = findParentBySelector(element, '.ThemeOfficeSubMenu');
					var path = mountPath(subMenu.id);
					menuItems.push({
						id: idSeq,
						subMenuId: subMenu.id,
					 	descFunc: descFunc,
					 	path: path,
					 	descFuncSearch: removerAcentos(descFunc),
					 	pathSearch: removerAcentos(path),
					 	elem: element
					});
					
					idSeq++;
				}
			});

			ready(function(){

				document.querySelectorAll('.nti-utils-close').forEach(function(element) {
					element.addEventListener('click',function(e){
						e.preventDefault();
						e.stopPropagation();
						elemDivParent.style.display = "none";
					});
				});

				//Eventos que atualizam dados
				document.getElementById("auxSigFuncionalidade").addEventListener('keyup', function (e){
					//console.log(this.value)
					renderFunctionsDropDown(this.value);
				});

				document.getElementById("auxListFuncionalidades").addEventListener('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					var elem = e.target;
					if (!elem.classList.contains('nti-utils-func')) {
						elem = findParentBySelector(elem, '.nti-utils-func');
					}
					if (elem) {
						var id = Number.parseInt(elem.getAttribute('data-nti-func-id'));
						for (var m in menuItems) {
							if (menuItems[m].id == id) {
								execMenuItem(menuItems[m].elem);
							}
						}	
					}
				});

				//nti-utils-func
				renderFunctionsDropDown('');
			});
		}

	} catch (e) {
		console.error('NTI-Utils hasn\'t started...', e);
	}

}