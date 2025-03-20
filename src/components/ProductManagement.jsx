
const ProductManagement = () => {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [product, setProduct] = useState({
      name: "",
      quantity: "",
      costprice: "",
      unit: "kg",
      pricePerQuantity: 0,
      shopname: ""  // Added shopname
    });
  
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const handleKeyDown = (e) => e.key === "Escape" && setIsOpen(false);
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProduct((prev) => {
        const updated = { ...prev, [name]: name === "quantity" || name === "costprice" ? Number(value) : value };
  
        if (updated.costprice > 0 && updated.quantity > 0) {
          updated.pricePerQuantity = (updated.costprice / updated.quantity).toFixed(2);
        }
        return updated;
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
  
      if (product.costprice < 0 || product.quantity <= 0) {
        setError("Invalid input values. Please ensure all fields are filled correctly.");
        setLoading(false);
        return;
      }
  
      try {
        await axios.post(`${API_BASE_URL}/api/products`, product);
        setProduct({ name: "", quantity: "", costprice: "", unit: "kg", pricePerQuantity: 0, shopname: "" });
        refreshProducts();
        setIsOpen(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to add product.");
      } finally {
        setLoading(false);
      }
    };
 
};

export default ProductManagement;
