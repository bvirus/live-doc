## Debug notes

### The slider is overflowing it's parent container!
Check the `.live-slider-fill` element to see if it has negative percentage
values in it's absolute positioning. The `[low, high]` array passed into
`slider.setValue` must only contain numbers between 0 and 1.