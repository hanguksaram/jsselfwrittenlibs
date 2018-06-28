$(function () {
    LookAtGoods();
});
var viewPort;var userDelay = 1000;var ecommerceArry = [];var header;
var preparedDataLayer = {
        event: 'list_view',
        ecommerce: {
            impressions: []
        }
    };
var scrollsTimeDifference = 0;
//самописный евент хэндлер для пуша в датулэйер
$(document).on("datalayer:push",
    function (event, data) {
        //console.log(JSON.parse(data));
        dataLayer.push(JSON.parse(data));
        //console.log("EventWasHandled");
    });
function LookAtGoods() {

    $('.ecommerced').each(function() {
        //храним позицию только видимых элементов
      
        var display = $(this).parents('.ctlg-list__item ').css('display');
        var visibility = $(this).parents('.ctlg-list__item ').css('visibility');
        //if (typeof (visibility) === 'undefined' || typeof (display) === 'undefined')
        //{
        //    ecommerceArry.push({
        //        posTop: Number($(this).parents('.product__inner').offset().top),
        //        posDown: Number($(this).parents('.product__inner').offset().top) + Number($(this).parents('.product__inner')[0].offsetHeight),
        //        scrolled: false,
        //        attrs: {
        //            name: $(this).attr('data-name'),
        //            id: $(this).attr('data-id'),
        //            price: parseFloat($(this).attr('data-price')),
        //            brand: $(this).attr('data-brand'),
        //            category: $(this).attr('data-cathegory'),
        //            //'variant': 'Gray',
        //            list: $(this).attr('data-list'), 
        //            position: $(this).attr('data-position')
        //        }
        //    });      
        //}
        if (display != 'none' && visibility != 'hidden') {
            if (Number($('.layout-main__content')[0].offsetLeft) <= Number($(this).offset().left) &&
                Number($(this).offset().left) <=
                (Number($('.layout-main__content')[0].offsetLeft) +
                    Number($('.layout-main__content')[0].offsetWidth))) {
                        ecommerceArry.push({
                        posTop: Number($(this).parents('.product__inner').offset().top),
                        posDown: Number($(this).parents('.product__inner').offset().top) + Number($(this).parents('.product__inner')[0].offsetHeight),
                        scrolled: false,
                        attrs: {
                            name: $(this).attr('data-name'),
                            id: $(this).attr('data-id'),
                            price: parseFloat($(this).attr('data-price')),
                            brand: $(this).attr('data-brand'),
                            category: $(this).attr('data-cathegory'),
                            //'variant': 'Gray',
                            list: $(this).attr('data-list'), 
                            position: $(this).attr('data-position')
                        }
                    });             
            }
        }
    });
}
// получаем вьюпорт при рендере страницы и при изменении размкера браузера
// и высоту зафиксированного хедера страницы, так как он уменьшает вьюпорт
$(window).on('load resize', function () { viewPort = Number($(window).height());
    header = Number($('header')[0].offsetHeight);
});
$(window).scroll(function (event) {
    //получаем положение скроллбара
    var scrolled = $(window).pageYOffset || document.documentElement.scrollTop;
    scrolled = Number(scrolled);
    //колво времени пройденное от времени рендера страница до события скролла
    var eventDelay = Number(event.timeStamp);
    if (scrollsTimeDifference === 0) scrollsTimeDifference = eventDelay;
    //находим период времени между двумя последовательными скроллами
    else scrollsTimeDifference -= eventDelay;
    scrollsTimeDifference = Math.abs(scrollsTimeDifference);
    //если период времени больше скорости реакции пользователя - понимае что пользователь задержал свой взгляд на какой-либо информации
    if (scrollsTimeDifference >= userDelay) {
        if (preparedDataLayer.ecommerce.impressions.length > 0) {
            for (var j = 0; j < ecommerceArry.length; j++) {
                // На готовящиеся к отправке товары ставим признак проскроллен с целью избежать повторной отправки
                for (var k = 0; k < preparedDataLayer.ecommerce.impressions.length; k++) {
                    if (ecommerceArry[j].attrs.id === preparedDataLayer.ecommerce.impressions[k].id) {
                        ecommerceArry[j].scrolled = true;
                    }
                }
            }
            //клонирование с целью борьбы с багом консоли по причине последующего зануления массива в 126 строке
            var clonedLayer = Object.assign({}, preparedDataLayer);
            //console.log(preparedDataLayer);
            //console.log(JSON.stringify(clonedLayer));
          
            $(document).trigger("datalayer:push", JSON.stringify(clonedLayer));

        }
    }
    preparedDataLayer.ecommerce.impressions = [];
    for (var i = 0; i < ecommerceArry.length; i++) {
        //основной алгоритм определения находится ли товар в окне просмотра браузера 
        if (ecommerceArry[i].scrolled === false && scrolled + header <= ecommerceArry[i].posTop && ecommerceArry[i].posDown <= scrolled + viewPort - header)
            preparedDataLayer.ecommerce.impressions.push(ecommerceArry[i].attrs);
    }
    scrollsTimeDifference = eventDelay;
});

function LookAtSet() {
    
}
function AddSetToCart() {
    var products = [];
    $('.action-goods__description').each(function() {
        products.push({
            name: $(this).attr('data-name'),
            id: $(this).attr('data-id'),
            price: parseFloat($(this).attr('data-price')),
            brand: $(this).attr('data-brand'),
            category: $(this).attr('data-cathegory'),
            quantity: Number($(this).attr('data-count'))
        });
    });

    dataLayer.push({
        event: 'addToCart',
        ecommerce: {
            add: {
                products
            }
        }
    });

}
function RemoveSetFromCart() {
    
    var products = [];
    $('.product-action').each(function() {
        products.push({
            name: $(this).attr('data-name'),
            id: $(this).attr('data-id'),
            price: parseFloat($(this).attr('data-price')),
            brand: $(this).attr('data-brand'),
            category: $(this).attr('data-cathegory'),
            quantity: Number($(this).attr('data-count'))
    });
    });

dataLayer.push({
        event: 'removeFromCart',
        ecommerce: {
            remove: {
                products
            }
        }
    });    

}


function AddGoodsToCart(self, count, isEmptyBottle) {
    if (isEmptyBottle) return;
        
    

    dataLayer.push({
        event: 'addToCart',
        ecommerce: {
            add: {
                products: [{                        // Массив добавленных(разных) в корзину товаров
                    name: self.attr('data-name'),
                    id: self.attr('data-id'),
                    price: parseFloat(self.attr('data-price')),
                    brand: self.attr('data-brand'),
                    category: self.attr('data-cathegory'),
                    //'variant': 'Gray',
                    quantity: count
                }]
            }
        }
    });
    console.log({
        event: 'addToCart',
        ecommerce: {
            add: {
                products: [{                        // Массив добавленных(разных) в корзину товаров
                    name: self.attr('data-name'),
                    id: self.attr('data-id'),
                    price: parseFloat(self.attr('data-price')),
                    brand: self.attr('data-brand'),
                    category: self.attr('data-cathegory'),
                    //'variant': 'Gray',
                    quantity: count
                }]
            }
        }
    });




}



//dataLayer.push({
//        event: 'list_view',
//        ecommerce: {
//            impressions: [
//                {
//                    name: self.attr('data-name'),
//                    id: self.attr('data-id'),
//                    price: self.attr('data-price').replace(',','.' ),
//                    brand: self.attr('data-brand'),
//                    category: self.attr('data-cathegory'),
//                    //'variant': 'Gray',
//                    list: self.attr('data-list'),   // название списка в котором показан товар
//                    position: self.attr('data-position')            // позиция товара в списке
//                }
//            ]
//        }
//    });
//    console.log(`{
//        'event': 'list_view',
//        'ecommerce': {
//            'impressions': [
//                {
//                    'name': ${self.attr('data-name')},
//                    'id': ${self.attr('data-id')},
//                    'price': ${self.attr('data-price').replace(',', '.')},
//                    'brand': ${self.attr('data-brand')},
//                    'category': ${self.attr('data-cathegory')},
//                    //'variant': 'Gray',
//                    'list': ${self.attr('data-list')},   // название списка в котором показан товар
//                    'position': ${self.attr('data-position')}            // позиция товара в списке
//                }
//               ]
//        }
//    }`);


//}
function ClickOnGoods(self) {
    dataLayer.push({
        event: 'productClick',
        ecommerce: {

            click: {
                actionField: { list: self.attr('data-list') },      // название списка по которому был клик на товар
                products: [{
                    name: self.attr('data-name'),
                    id: self.attr('data-id'),
                    price: parseFloat(self.attr('data-price')),
                    brand: self.attr('data-brand'),
                    category: self.attr('data-cathegory'),
                    //'variant': 'Gray',
                    // название списка в котором показан товар
                    position: self.attr('data-position')
                }]
            }
        }
    });
    console.log({
        event: 'productClick',
        ecommerce: {

            click: {
                actionField: { list: self.attr('data-list') },      // название списка по которому был клик на товар
                products: [{
                    name: self.attr('data-name'),
                    id: self.attr('data-id'),
                    price: parseFloat(self.attr('data-price')),
                    brand: self.attr('data-brand'),
                    category: self.attr('data-cathegory'),
                    //'variant': 'Gray',
                    // название списка в котором показан товар
                    position: self.attr('data-position')
                }]
            }
        }
    });


}
function RemoveGoodsFromCart(self, count, isEmptyBottle) {
    if (isEmptyBottle)  return;
       
    
    dataLayer.push({
        event: 'removeFromCart',
        ecommerce: {
            remove: {
                products: [{                          //  массив удаленных товаров из корзины(разных)
                    name: self.attr('data-name'),
                    id: self.attr('data-id'),
                    price: parseFloat(self.attr('data-price')),
                    brand: self.attr('data-brand'),
                    category: self.attr('data-cathegory'),
                    //'variant': 'Gray',
                    // название списка в котором показан товар
                    quantity: count
                }]
            }
        }
    });
    console.log({
        event: 'removeFromCart',
        ecommerce: {
            remove: {
                products: [{                          //  массив удаленных товаров из корзины(разных)
                    name: self.attr('data-name'),
                    id: self.attr('data-id'),
                    price: parseFloat(self.attr('data-price')),
                    brand: self.attr('data-brand'),
                    category: self.attr('data-cathegory'),
                    //'variant': 'Gray',
                    // название списка в котором показан товар
                    quantity: count
                }]
            }
        }
    });




}

