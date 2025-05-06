import React, { useState, useEffect } from 'react';
import farmerService from '../../Appwrite/Farmer';
import userService from '../../Appwrite/Customer';
import productService from '../../Appwrite/Product';

const collectionMap = {
  farmers: () => farmerService.listFarmers(),
  user: () => userService.listCustomers(),
  orders: () => productService.listOrders(),
  community: () => farmerService.listCommunityPosts(),
  products: () => productService.listAllProducts?.() || Promise.resolve([]), // Add this method if needed
};

function AdminPage() {
  const [selectedCollection, setSelectedCollection] = useState('farmers');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await collectionMap[selectedCollection]?.();
        setDocuments(response?.documents || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedCollection]);

  const renderTable = () => {
    if (loading) return <p>Loading...</p>;
    if (!documents.length) return <p>No data found.</p>;
  
    const headers = Object.keys(documents[0]);
  
    return (
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-max w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              {headers.map(header => (
                <th key={header} className="border p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header} className="border p-2">
                    {JSON.stringify(doc[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        {Object.keys(collectionMap).map(collection => (
          <button
            key={collection}
            className={`px-4 py-2 rounded ${
              selectedCollection === collection ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedCollection(collection)}
          >
            {collection}
          </button>
        ))}
      </div>

      {renderTable()}
    </div>
  );
}

export default AdminPage;
