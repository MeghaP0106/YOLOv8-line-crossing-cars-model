"""Execute the project notebook in a real kernel and save successful outputs."""
from pathlib import Path
import nbformat
from nbclient import NotebookClient
from jupyter_client import KernelManager
from jupyter_client.kernelspec import KernelSpecManager

root = Path(__file__).resolve().parent
notebook_path = root / "yolov8_single_line_tracking.ipynb"
nb = nbformat.read(notebook_path, as_version=4)
ksm = KernelSpecManager(kernel_dirs=[str(root / ".venv" / "share" / "jupyter" / "kernels")])
km = KernelManager(kernel_name="yolo-cpu", kernel_spec_manager=ksm)
client = NotebookClient(nb, km=km, timeout=600, resources={"metadata": {"path": str(root)}})
client.execute()
nbformat.write(nb, notebook_path)
for cell in nb.cells:
    for output in cell.get("outputs", []):
        if output.get("output_type") == "stream":
            text = output.get("text", "")
            if "Saved " in text or "Verified " in text or "PyTorch:" in text or "Total crossings" in text:
                print(text.strip())
print("Notebook completed successfully in its project Jupyter kernel.")
