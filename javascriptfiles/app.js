class Advertisement{
    constructor(title, content, style, time)
    {
        this.title= title;
        this.content = content;
        this.style = style;
        this.time = time;   
    }

} 


let advertisementList1=[];
advertisementList1.push(new Advertisement("Real Madrid","Real Madrid","https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",5000));
advertisementList1.push(new Advertisement("Manchester City","Manchester City","https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/800px-Manchester_City_FC_badge.svg.png",3000));
advertisementList1.push(new Advertisement("Manchester United","Manchester United","https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/640px-Manchester_United_FC_crest.svg.png",4000));
advertisementList1.push(new Advertisement("Barcelona","Barcelona","https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png",4000));
advertisementList1.push(new Advertisement("Paris Saint Germain","Paris Saint Germain","https://en.psg.fr/img/DefaultOpenGraphImage.jpg?2019",5000));

let advertisementList2=[];
advertisementList2.push(new Advertisement("NIKE","JUST DO IT","https://blog.klekt.com/wp-content/uploads/2021/01/Nike-Dunk-Low-Team-Green-Feature.jpg",5000));
advertisementList2.push(new Advertisement("ADIDAS","let's do this","https://assets.adidas.com/images/w_600,f_auto,q_auto/c71df619024f4cc69405acfa0142a897_9366/Forum_Exhibit_Low_Shoes_White_GZ5389_01_standard.jpg",4000));
advertisementList2.push(new Advertisement("PUMA","your black style","https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/380825/01/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-Toddler-Shoes",3000));
advertisementList2.push(new Advertisement("REEBOK","reebok life","https://mastersport.co.il/wp-content/uploads/2019/04/REEBOK-CLASSIC-LEATHER-50150.jpg",4000));
advertisementList2.push(new Advertisement("UNDER ARMOUR","run faster! ","https://www.si.com/.image/t_share/MTc1NjA4MjAxNjY2ODk3Mzkw/under-armour-breakthru.jpg",3000));

let advertisementList3=[];
advertisementList3.push(new Advertisement("AUDI","LET'S DRIVING WITH STYLE","https://www.audi.co.il/wp-content/uploads/2020/11/DGT_110592_AudiNewSite_D2-2.jpg",3000));
advertisementList3.push(new Advertisement("MERCEDEZ","Our new Mercedes","https://www.mercedes-benz.co.il/wp-content/uploads/15C154_042-e1521967118774.jpg",5000));
advertisementList3.push(new Advertisement("BUGGATI","Let's live in another world","https://cdn.motor1.com/images/mgl/6MGkl/s1/bugatti-chiron-pur-sport.webp",3000));
advertisementList3.push(new Advertisement("TOYOTA","live like toyota","https://www.superjeep.co.il/wp-content/uploads/2021/04/toyota-4runner-04.jpg",5000));
advertisementList3.push(new Advertisement("FERRARI","Fly into space","https://www.topgear.com/sites/default/files/cars-car/image/2020/07/dsc09285.jpg",3000));







$(document).ready(function(){
    var htmlPage = document.getElementById("index").className;
    console.log(htmlPage);
    index = 0;

    if(htmlPage == "index1"){
        setInterval(swapAdvertisements1, advertisementList1[index++%advertisementList1.length].time);
    }
    else if(htmlPage == "index2"){
        setInterval(swapAdvertisements2, advertisementList2[index++%advertisementList2.length].time);
    }
    else if(htmlPage == "index3"){
        setInterval(swapAdvertisements3, advertisementList3[index++%advertisementList3.length].time);
    }
   

    function swapAdvertisements1(){
        i = index++%advertisementList1.length;
        $('#advertisment_title').text(advertisementList1[i].content);
        $('#image_advrtisment').attr('src', advertisementList1[i].style);
    }

    function swapAdvertisements2(){
        i = index++%advertisementList2.length;
        $('#advertisment_title').text(advertisementList2[i].content);
        $('#image_advrtisment').attr('src', advertisementList2[i].style);
    }

    function swapAdvertisements3(){
        i = index++%advertisementList3.length;
        $('#advertisment_title').text(advertisementList3[i].content);
        $('#image_advrtisment').attr('src', advertisementList3[i].style);
    }
    
});

