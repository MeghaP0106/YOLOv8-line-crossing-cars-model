"""Create browser playback and preview assets from the project's actual videos."""
from pathlib import Path
import subprocess
import cv2
import imageio_ffmpeg

root = Path(__file__).resolve().parent
assets = root / 'assets'
assets.mkdir(exist_ok=True)
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-i', str(root / 'output_single_line.mp4'), '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(assets / 'annotated-web.mp4')], check=True)
for source, output in [('output_single_line.mp4', 'poster.jpg'), ('d.mp4', 'original-poster.jpg')]:
    capture = cv2.VideoCapture(str(root / source))
    try:
        capture.set(cv2.CAP_PROP_POS_MSEC, 9000)
        ok, frame = capture.read()
        if not ok:
            raise RuntimeError(f'Cannot extract preview from {source}')
        if not cv2.imwrite(str(assets / output), frame):
            raise RuntimeError(f'Cannot write {output}')
    finally:
        capture.release()
print('Browser video and posters are ready.')
