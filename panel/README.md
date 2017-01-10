# Panelization script

Run `generate-panel.sh` to create a `panel.kicad_pcb` file out of every boards of the UHK. Then you shall generate gerbers from `panel.kicad_pcb` and send them to the fab house of your choice.

Please note that `generate-panel.sh` merely places the boards next to each other based on static coordinate offsets and does not add routing, breakout tabs, or anything fancy. This may or may not work out for you.
