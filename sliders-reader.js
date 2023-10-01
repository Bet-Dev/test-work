window.addEventListener('load', () => {
    const slider = $$('#slider')[0]
    const actions = $$('#slider-btns a')
    const sliderTemplate = template($$('#slider-template')[0].innerHTML)
    const updateSliders = update('#slider')
    const updateSlidersWith = (data) => {
        const sliders = data.reduce((s, item) => s + sliderTemplate(item), '')
        updateSliders(sliders)

        return data
    }
    const resetSliderAnim = (n) => {
        slider.classList.remove('slider-animate')
        slider.offsetWidth
        slider.classList.add('slider-animate')
        slider.style.setProperty('--slides-count', n)
    }

    actions.forEach((action) => {
        const uri = new URL(action.href)
        uri.searchParams.set('format', 'json')
        action.addEventListener('click', clickHandler(uri, action, actions))
    })
    document.addEventListener('scrollend', pauseOnScroll)


    function update (selector) {
        return (html) => {
            $$(selector).forEach((el) => {
                el.innerHTML = html
            })
        }
    }
    function template (tmplString) {
        const tags = /\{(\w+)\}/g
        return (data) => {
            return tmplString.replace(tags, (match, key) => {
                return data[key] || ''
            })
        }
    }
    function clickHandler (uri, target, actions) {
        return (e) => {
            e.preventDefault()

            fetch(uri.href)
                .then((res) => res.json())
                .then(updateSlidersWith)
                .then((items) => {
                    actions.forEach(el => toggleActive(el, el === target))
                    resetSliderAnim(items.length)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }
    function toggleActive(target, status) {
        target.classList.toggle('active', status)
    }
    function pauseSliderScrolling() {
        slider.classList.remove('slider-animate')
    }
    function pauseOnScroll() {
        const shift = slider.getBoundingClientRect().bottom

        if (shift < 0) {
            pauseSliderScrolling()
        } else if (slider.classList.contains('slider-animate')) {
            // do nothing
        } else {
            const n = slider.style.getPropertyValue('--slides-count')
            resetSliderAnim(n)
        }
    }
});
function $$ (selector) {
    return document.querySelectorAll(selector)
}
