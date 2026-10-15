# LineSight showcase

Run `npm start` from this project folder, then open http://localhost:3000.

The site is a static showcase of the completed notebook run: 687 frames, 9 downward crossings and 0 upward crossings. Source/result buttons switch footage while preserving playback position. Download links provide the original annotated MP4 and notebook. Inference runs in the notebook, not in the website.

The server binds only to localhost and serves an explicit list of public assets; the Python environment and model weights are not exposed. No JavaScript framework or npm dependencies are required. Google Fonts are optional; system fonts provide a fallback offline.

`assets/annotated-web.mp4` is the browser-compatible H.264 conversion of `output_single_line.mp4`. Rerun `prepare_web_assets.py` with the project Python environment after generating a new result. Update the displayed statistics if the input or model configuration changes.
