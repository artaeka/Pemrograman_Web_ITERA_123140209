"""Latihan 2: Kalkulator konversi suhu interaktif."""

celsius = float(input("Masukkan suhu dalam Celsius (°C): "))

fahrenheit = celsius * 9 / 5 + 32
kelvin = celsius + 273.15

print("-" * 35)
print(f"Celsius    : {celsius:>10.2f} °C")
print(f"Fahrenheit : {fahrenheit:>10.2f} °F")
print(f"Kelvin     : {kelvin:>10.2f} K")
print("-" * 35)