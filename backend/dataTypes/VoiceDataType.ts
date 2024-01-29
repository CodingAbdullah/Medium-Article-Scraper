// Custom data type for working with voices
// Six poosible voices from the OpenAI TTS API
export default interface VoiceDataType {
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
}