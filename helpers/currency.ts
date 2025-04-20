const rupiahFormat = (angka: number): string => {
  const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
  return formatRupiah;
}

export {
    rupiahFormat,
}