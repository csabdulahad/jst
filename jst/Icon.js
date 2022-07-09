(() => {

    class Icon {

        #iconPool = {};

        #prepare(ele) {
            ele = jst.eleId(ele);
            if (!ele) throw new Error(`No icon element found for ${ele}`);

            // get the unique id for the icon element so that we can track its animation class
            // and restore it back to the original state. if no id attribute is found; so give
            // it a unique id and save it in the pool.
            let id = $(ele).attr('id');
            if (!id) {
                id = 'jst-id-' + Icon.#getUId();
                $(ele).attr('id', id);
            }

            // define an object for holding various information for the icon and its state, parent.
            let obj = {};

            obj.id = id;
            obj.parent = ele;
            obj.icon = jst.getChildOf('.jst-icon-swap', ele);
            obj.original = $(obj.icon).html();

            // before returning the obj modify the parent opacity
            $(obj.parent).animate({opacity: 0.6});

            // also make it disable
            $(obj.parent).attr('disabled', 'true');

            // now save it in the icon pool
            this.#iconPool[id] = obj;

            return obj;
        }

        #getObj(ele) {
            ele = jst.eleId(ele);

            if (!ele) throw new Error(`No element found in the document as specified by the argument.`);

            let id = $(ele).attr('id');
            if (!id) throw new Error('This element did not go through icon methods yet.');

            if (this.#iconPool.missing(id)) throw new Error('This element was not found in the icon pool.');

            return this.#iconPool[id];
        }

        #apply(ele, icon, animType) {
            let obj = this.#prepare(ele);

            // store the animation type into the obj for removing the css class later
            obj.anim_type = animType;

            // set the animation class
            $(obj.icon).addClass(animType);

            // set the icon value
            $(obj.icon).html(icon);
        }

        pulse(ele, icon = 'hourglass_full') { this.#apply(ele, icon, 'jst-anim-pulse'); }

        spin(ele, icon = 'loop') { this.#apply(ele, icon, 'jst-anim-spin'); }

        still(ele, icon = 'schedule') { this.#apply(ele, icon, ''); }

        restore(ele) {
            let obj = this.#getObj(ele);

            // remove the animation class
            $(obj.icon).removeClass(obj.anim_type);

            // restore back the original content
            $(obj.icon).html(obj.original);

            // restore parent opacity
            $(obj.parent).animate({opacity: '1'});

            // make parent intractable
            $(obj.parent).removeAttr('disabled');
        }

        static #getUId = () => new Date().valueOf();

    }

    window.Icon = new Icon();

})();