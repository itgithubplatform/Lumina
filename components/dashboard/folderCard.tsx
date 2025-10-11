import { motion } from 'framer-motion';

export function FolderCard({ title, icon: Icon, count, color }: {
  title: string;
  icon: any;
  count: number;
  color: string;
}) {
  const colorClasses = {
    gray: 'from-gray-400 to-gray-600 bg-gray-50 text-gray-700',
    blue: 'from-blue-400 to-blue-600 bg-blue-50 text-blue-700',
    green: 'from-green-400 to-green-600 bg-green-50 text-green-700',
    purple: 'from-purple-400 to-purple-600 bg-purple-50 text-purple-700',
    orange: 'from-orange-400 to-orange-600 bg-orange-50 text-orange-700'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-lg p-6 border cursor-pointer hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[color as keyof typeof colorClasses].split(' ')[1]} rounded-lg p-3`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{count} items</p>
        </div>
      </div>
      
      <div className={`${colorClasses[color as keyof typeof colorClasses].split(' ')[2]} ${colorClasses[color as keyof typeof colorClasses].split(' ')[3]} rounded-lg p-3 text-center`}>
        <div className="text-lg font-bold">{count}</div>
        <div className="text-xs">Content Items</div>
      </div>
    </motion.div>
  );
}