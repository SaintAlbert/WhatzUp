import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { Platform, DomController, Events } from 'ionic-angular';

/**
 * Generated class for the ContentDrawerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'content-drawer',
    templateUrl: 'content-drawer.html'
})
export class ContentDrawerComponent {
    @Input('options') options: any;
    @Input() event: string;

    handleHeight: number = 0;
    bounceBack: boolean = true;
    thresholdTop: number = 200;
    thresholdBottom: number = 200;
    title;
    showTitle = "Custom Title Here";
    hideTitle = "Custom Title Here";
    hammer: any
    updown: any = false
    sharedStopUp: any = false

    constructor(public element: ElementRef,
        public renderer: Renderer,
        public domCtrl: DomController,
        public platform: Platform,
        private events: Events) {

    }

    ngOnInit() {
        this.sharedStopUp = false;
        this.events.unsubscribe(this.event + ':open', null);
        this.events.subscribe(this.event + ':open', () => {
            //console.log(this.event)
            this.sharedStopUp = false;
            this.openPan()
        })
        this.events.subscribe(this.event + ':openShared', () => {
            //console.log(this.event)
            this.sharedStopUp = true;
            this.openSharedPan()
        })
        //
        this.events.subscribe(this.event + ':openCrop', () => {
            //console.log(this.event)
            this.sharedStopUp = false;
            this.openFullPan()
        })
        
        this.events.unsubscribe(this.event + ':close', null);
        this.events.subscribe(this.event + ':close', () => {
            this.sharedStopUp = false;
            this.closePan();
        })
       
    }

    ngAfterViewInit() {
       
        //if (this.options.title) {
        //    this.showTitle = this.options.showTitle;
        //    this.hideTitle = this.options.hideTitle;
        //}
        if (this.options.handleHeight) {
            this.handleHeight = this.options.handleHeight;
        }

        if (this.options.bounceBack) {
            this.bounceBack = this.options.bounceBack;
        }

        if (this.options.thresholdFromBottom) {
            this.thresholdBottom = this.options.thresholdFromBottom;
        }

        if (this.options.thresholdFromTop) {
            this.thresholdTop = this.options.thresholdFromTop;
        }

        this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
        this.renderer.setElementStyle(this.element.nativeElement, 'padding-top', this.handleHeight + 'px');

        //let hammer = new window['Hammer'](this.element.nativeElement);
        this.hammer = new window['Hammer'](this.element.nativeElement.children[0]);
        this.hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_VERTICAL });
        //console.log(this.hammer)

        this.hammer.on('pan', (ev) => {
            this.handlePan(ev);
        });

        //this.hammer.on('tap', (ev) => {
        //    this.handlePan(ev);
        //});

    }

    

    public openPan() {
        this.domCtrl.write(() => {
            this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
            this.renderer.setElementStyle(this.element.nativeElement, 'top', '30%');
           
        });
        this.updown = true;
        
    }
    public openSharedPan() {
        this.domCtrl.write(() => {
            this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
            this.renderer.setElementStyle(this.element.nativeElement, 'top', '50%');

        });
        this.updown = false;
    }

    public openFullPan() {
        this.domCtrl.write(() => {
            this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
            this.renderer.setElementStyle(this.element.nativeElement, 'top', '0%');
           
        });
        this.updown = true;
    }
    public closePan() {
        
        this.domCtrl.write(() => {
            this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
            this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
            
        });
        this.updown = false;
    }

    handlePan(ev) {
        console.log(ev)
        //let newTop = ev.center.y;
        let newTop = (ev.additionalEvent === "panup" ? this.platform.height() - this.handleHeight : 0) + ev.deltaY;

        let bounceToBottom = false;
        let bounceToTop = false;

        if (this.bounceBack && ev.isFinal) {

            let topDiff = newTop - this.thresholdTop;
            let bottomDiff = (this.platform.height() - this.thresholdBottom) - newTop;

            topDiff >= bottomDiff ? bounceToBottom = true : bounceToTop = true;

        }

        if ((newTop < this.thresholdTop && ev.additionalEvent === "panup") || bounceToTop) {

            this.domCtrl.write(() => {
                this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
                //this.renderer.setElementStyle(this.element.nativeElement, 'top', '0px');
                this.renderer.setElementStyle(this.element.nativeElement, 'top', '0%');
               
            });
            this.updown = true;

        } else if (((this.platform.height() - newTop) < this.thresholdBottom && ev.additionalEvent === "pandown") || bounceToBottom) {

            this.domCtrl.write(() => {
                this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
                this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
               
            });
            this.updown = false;

        } else {

            this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'none');

            if (newTop > 0 && newTop < (this.platform.height() - this.handleHeight)) {

                if (ev.additionalEvent === "panup" || ev.additionalEvent === "pandown") {

                    this.domCtrl.write(() => {
                        this.renderer.setElementStyle(this.element.nativeElement, 'top', newTop + 'px');
                        this.updown = false?true:false;
                    });

                }

            }

        }

    }



}


