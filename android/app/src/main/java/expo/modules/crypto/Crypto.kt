package expo.modules.crypto

import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.interfaces.ECPrivateKey
import java.security.interfaces.ECPublicKey
import java.security.spec.ECGenParameterSpec

class ECKeyGeneratorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "ECKeyGenerator"
    }

    @ReactMethod
    fun generateECKeys(promise: Promise) {
        try {
            // Initialize the EC key pair generator
            val keyPairGenerator = KeyPairGenerator.getInstance("EC")
            val ecSpec = ECGenParameterSpec("secp256r1") // P-256 curve
            keyPairGenerator.initialize(ecSpec)

            // Generate the key pair
            val keyPair: KeyPair = keyPairGenerator.generateKeyPair()

            // Encode the public and private keys in Base64
            val publicKey = keyPair.public as ECPublicKey
            val privateKey = keyPair.private as ECPrivateKey

            val publicKeyEncoded = Base64.encodeToString(publicKey.encoded, Base64.DEFAULT)
            val privateKeyEncoded = Base64.encodeToString(privateKey.encoded, Base64.DEFAULT)

            // Return the keys as a JSON object
            val result = mapOf(
                "publicKey" to publicKeyEncoded,
                "privateKey" to privateKeyEncoded
            )
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ECKeyGenerationError", "Failed to generate EC key pair", e)
        }
    }
}