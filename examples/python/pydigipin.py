import requests

BASE_URL = "http://localhost:5000"


def encode_digipin(latitude: float, longitude: float) -> str:
    """
    Call the DIGIPIN API to encode a latitude/longitude pair into a DIGIPIN code.
    """
    params = {"latitude": latitude, "longitude": longitude}
    resp = requests.get(f"{BASE_URL}/api/digipin/encode", params=params, timeout=5)
    resp.raise_for_status()
    data = resp.json()
    return data["digipin"]


def decode_digipin(digipin: str) -> dict:
    """
    Call the DIGIPIN API to decode a DIGIPIN back to coordinates and metadata.
    """
    params = {"digipin": digipin}
    resp = requests.get(f"{BASE_URL}/api/digipin/decode", params=params, timeout=5)
    resp.raise_for_status()
    return resp.json()


def prompt_float(prompt_text: str) -> float:
    """
    Keep asking the user for a float until they give a valid number.
    """
    while True:
        value = input(prompt_text).strip()
        try:
            return float(value)
        except ValueError:
            print("Please enter a valid number (e.g. 22.5726).")


def main() -> None:
    print("=== DIGIPIN Python Client ===")
    print(f"Using API base URL: {BASE_URL}")
    print("Make sure the DIGIPIN server (npm start or npm run dev) is running.\n")

    while True:
        print("\nChoose an option:")
        print("1) Encode latitude/longitude to DIGIPIN")
        print("2) Decode DIGIPIN to coordinates")
        print("0) Exit")
        choice = input("Enter choice (0/1/2): ").strip()

        if choice == "0":
            print("Goodbye!")
            break

        elif choice == "1":
            print("\n--- Encode (lat/lon to DIGIPIN) ---")
            lat = prompt_float("Enter latitude  : ")
            lon = prompt_float("Enter longitude : ")

            try:
                code = encode_digipin(lat, lon)
                print(f"\nDIGIPIN for ({lat}, {lon}) is: {code}")
            except requests.RequestException as e:
                print(f"\nError while calling encode API: {e}")

        elif choice == "2":
            print("\n--- Decode (DIGIPIN to coordinates) ---")
            digipin = input("Enter DIGIPIN code (e.g. 4P3-JK8-52C9): ").strip()

            if not digipin:
                print("DIGIPIN cannot be empty.")
                continue

            try:
                result = decode_digipin(digipin)
                print("\nDecoded result:")
                for key, value in result.items():
                    print(f"  {key}: {value}")
            except requests.RequestException as e:
                print(f"\nError while calling decode API: {e}")

        else:
            print("Invalid choice, please enter 0, 1, or 2.")


if __name__ == "__main__":
    main()
