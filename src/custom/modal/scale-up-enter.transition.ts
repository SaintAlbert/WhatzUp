import { Animation, PageTransition } from 'ionic-angular';

export class ModalScaleUpEnterTransition extends PageTransition {

    public init() {
        super.init();
        const ele = this.enteringView.pageRef().nativeElement;
        var css = this.plt.Css;
        var modalElement = ele.querySelector('.modal-wrapper')
        //var fromPosition = this.enteringView.data.position;
        var fromPosition = modalElement.getBoundingClientRect();

        var imgElement = ele.querySelector('ion-avatar img');
        var toPosition = imgElement.getBoundingClientRect();
        var flipS = fromPosition.width / toPosition.width;
        var flipY = fromPosition.top - toPosition.top;
        var flipX = fromPosition.left - toPosition.left;

        var image = new Animation(this.plt, imgElement);
        imgElement.style[css.transformOrigin] = '0 0';
        image.fromTo('translateY', flipY + "px", '0px')
            .fromTo('translateX', flipX + "px", '0px')
            .fromTo('scale', flipS, 1)
            .afterClearStyles([css.transformOrigin]);
        this.easing('ease-in-out')
            .duration(50)
            .add(image);

        var imgElementMain = ele.querySelector('.imgBox img');
        var toPosition = imgElementMain.getBoundingClientRect();
        var flipS = (fromPosition.width / toPosition.width) / (fromPosition.width / toPosition.width);
        var flipY = (fromPosition.top - toPosition.top) - (toPosition.top / 2);
        var flipX = (fromPosition.left - toPosition.left) - (toPosition.left / 2);

        var imageMain = new Animation(this.plt, imgElementMain);
        imgElementMain.style[css.transformOrigin] = '0 0';
        imageMain.fromTo('translateY', flipY + "px", '0px')
            .fromTo('translateX', flipX + "px", '0px')
            .fromTo('scale', flipS, 1)
            .afterClearStyles([css.transformOrigin]);
        this.easing('ease-in-out')
            .duration(150)
            .add(imageMain);

        

        var enteringPageEle = this.enteringView.pageRef().nativeElement;
        var enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
        var enteringBackBtnEle = enteringPageEle.querySelector('.back-button');
        var enteringNavBar = new Animation(this.plt, enteringNavbarEle);
        enteringNavBar.afterAddClass('show-navbar');
        this.add(enteringNavBar);
        var enteringBackButton = new Animation(this.plt, enteringBackBtnEle);
        this.add(enteringBackButton);
        enteringBackButton.afterAddClass('show-back-button');
     
        const wrapper = new Animation(this.plt, modalElement);
        wrapper.beforeStyles({ 'transform': 'scale(0)', 'opacity': 1 });
        wrapper.fromTo('transform', 'scale(0)', 'scale(1.0)');
        wrapper.fromTo('opacity', 1, 1);
        this.element(this.enteringView.pageRef())
            .duration(500)
            .easing('cubic-bezier(.1, .7, .1, 1)')
            //.easing('ease-in-out')
            .add(wrapper);


      

    }
}