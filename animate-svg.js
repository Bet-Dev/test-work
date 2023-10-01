window.addEventListener('load', () => {
    const planeBox = $$('#plane')[0]
    const plane = $$('#plane-holder')[0]
    const pathLeft = $$('#path-left')[0]
    const pathRight = $$('#path-right')[0]

    const left = { distance: 0, prev: {x:0, y:0} }
    const right = { distance: 0, prev: {x:0, y:0} }

    const leftFlight = gsap.to(left, buildConfig(pathLeft, left))
    const rightFlight =  gsap.to(right, buildConfig(pathRight, right))

    const tl = gsap.timeline({repeat: -1, repeatDelay: 3})
    tl.add(leftFlight, 0)
    tl.add(rightFlight, ">")

    function buildConfig (path, val) {
        const fit = makeFit(plane.getBBox(), path.getBBox())
        let {x: shiftX, y: shiftY} = path.getBBox()

        planeBox.append(addRoute(path, fit, shiftX, shiftY))

        return {
            distance: path.getTotalLength(),
            // repeat: 1,
            duration: 10, // seconds
            motionPath: path.getAttribute('d'),
            onUpdate: () => {
                const point = path.getPointAtLength(val.distance);
                const angle = setAngle(val.prev, point)
                const scale = setScale(point.y)
                const transform = `translate(${0.7 * point.x / fit - shiftX} ${point.y / fit - shiftY}) scale(${scale}) rotate(${angle} 50 50)`

                plane.setAttribute('transform', transform);
                val.prev.x = point.x
                val.prev.y = point.y
            }
        }
    }

    function makeFit (borderBox, targetBox) {
        return Math.max(
            targetBox.width / borderBox.width,
            targetBox.height / borderBox.height
        );
    }
    function setScale(y) {
        return 0.3 * ( 1 + (200 - y)/200)
    }
    function setAngle(prev, next) {
        const x = next.x - prev.x
        const y = next.y - prev.y
        return Math.atan2(y, x) * 180 / Math.PI
    }
    function addRoute (originPath, fit = 1, shiftX = 0, shiftY = 0) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', originPath.getAttribute('d'))
        path.setAttribute('stroke', '#66161e')
        path.setAttribute('stroke-width', '2')
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke-dasharray', '5 5')
        fit = 1.21 * fit
        path.setAttribute('transform', `scale(${1/fit}) translate(${-shiftX} ${-shiftY})`)

        return path
    }
});
