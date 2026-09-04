"""Fixed local Kokoro synthesis adapter. stdin/stdout JSON only; no network or shell execution."""
import json, sys
from pathlib import Path
import soundfile as sf
from kokoro_onnx import Kokoro
from misaki.espeak import EspeakG2P

sys.stdin.reconfigure(encoding="utf-8")
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent
MODEL = ROOT / "models" / "kokoro-v1.0.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
MAX_TEXT = 4000
G2P = EspeakG2P(language="es")

def main():
    try:
        request = json.loads(sys.stdin.read())
        text = request.get("text")
        output = request.get("outputPath")
        if not isinstance(text, str) or not text.strip() or len(text) > MAX_TEXT or not isinstance(output, str):
            raise ValueError("VOICE_TTS_INVALID_TEXT")
        target = Path(output).resolve()
        if target.suffix.lower() != ".wav": raise ValueError("VOICE_TTS_FAILED")
        phonemes, _ = G2P(text.strip())
        if not phonemes.strip(): raise ValueError("VOICE_TTS_INVALID_TEXT")
        kokoro = Kokoro(str(MODEL), str(VOICES))
        audio, sample_rate = kokoro.create(phonemes, "ef_dora", is_phonemes=True)
        sf.write(target, audio, sample_rate, subtype="PCM_16")
        print(json.dumps({"ok": True, "sampleRate": sample_rate, "voice": "ef_dora"}, ensure_ascii=False))
    except Exception as error:
        code = str(error) if str(error).startswith("VOICE_TTS_") else "VOICE_TTS_FAILED"
        print(json.dumps({"ok": False, "errorCode": code}, ensure_ascii=False))
        sys.exit(1)
if __name__ == "__main__": main()
